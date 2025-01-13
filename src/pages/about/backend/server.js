const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const port = 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL
}));
app.use(express.json());

// Configuração do banco de dados
let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  
  // Criar tabela de tokens se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      id INTEGER PRIMARY KEY,
      access_token TEXT,
      refresh_token TEXT,
      expires_at INTEGER
    );
  `);
})();

// Rota para iniciar o processo de login
app.get('/login', (req, res) => {
  const scope = 'user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECT_URI
    }).toString()
  );
});

// Callback do Spotify
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code'
      }).toString(),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, refresh_token } = response.data;
    const expires_at = Date.now() + (response.data.expires_in * 1000);

    // Salvar tokens no banco de dados
    await db.run(`
      INSERT OR REPLACE INTO tokens (id, access_token, refresh_token, expires_at)
      VALUES (1, ?, ?, ?)
    `, [access_token, refresh_token, expires_at]);

    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.redirect(`${process.env.FRONTEND_URL}?auth=error`);
  }
});

// Rota para obter o token atual
app.get('/token', async (req, res) => {
  try {
    const tokens = await db.get('SELECT * FROM tokens WHERE id = 1');
    
    if (!tokens || !tokens.access_token) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Verificar se o token precisa ser atualizado
    if (Date.now() >= tokens.expires_at) {
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
          new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: tokens.refresh_token
          }).toString(),
          {
            headers: {
              'Authorization': 'Basic ' + Buffer.from(
                process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
              ).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );

        const newTokens = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token || tokens.refresh_token,
          expires_at: Date.now() + (response.data.expires_in * 1000)
        };

        // Atualizar tokens no banco de dados
        await db.run(`
          UPDATE tokens 
          SET access_token = ?, refresh_token = ?, expires_at = ?
          WHERE id = 1
        `, [newTokens.access_token, newTokens.refresh_token, newTokens.expires_at]);

        return res.json({ access_token: newTokens.access_token });
      } catch (error) {
        console.error('Erro ao atualizar token:', error);
        return res.status(500).json({ error: 'Erro ao atualizar token' });
      }
    }

    res.json({ access_token: tokens.access_token });
  } catch (error) {
    console.error('Erro ao acessar banco de dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Spotify API Backend está funcionando!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
