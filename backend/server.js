const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
console.log('Origens permitidas:', allowedOrigins);

// Configuração CORS alternativa
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Configuração do banco de dados
let db;
(async () => {
  try {
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
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
})();

// Middleware para logging melhorado
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Rota para iniciar o processo de login
app.get('/login', (req, res) => {
  const scope = 'user-read-currently-playing user-read-playback-state';
  const state = Math.random().toString(36).substring(7);
  
  // Salvar state para validação posterior
  req.session = req.session || {};
  req.session.spotifyState = state;
  
  const authorizeURL = 'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECT_URI,
      state: state,
      show_dialog: true // Força mostrar diálogo de autorização
    }).toString();
  
  console.log('Redirecionando para autorização do Spotify:', authorizeURL);
  res.redirect(authorizeURL);
});

// Callback do Spotify
app.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  console.log('Callback recebida:', {
    code: code ? 'presente' : 'ausente',
    state: state ? 'presente' : 'ausente',
    error: error || 'nenhum'
  });

  if (error) {
    console.error('Erro retornado pelo Spotify:', error);
    return res.redirect(`${process.env.FRONTEND_URL}?auth=error&reason=${error}`);
  }

  if (!code) {
    console.error('Código de autorização não recebido');
    return res.redirect(`${process.env.FRONTEND_URL}?auth=error&reason=no_code`);
  }

  try {
    console.log('Iniciando troca de código por token...');
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

    console.log('Token recebido com sucesso');
    const { access_token, refresh_token } = response.data;
    const expires_at = Date.now() + (response.data.expires_in * 1000);

    await db.run(`
      INSERT OR REPLACE INTO tokens (id, access_token, refresh_token, expires_at)
      VALUES (1, ?, ?, ?)
    `, [access_token, refresh_token, expires_at]);

    console.log('Token salvo no banco de dados');
    console.log('Redirecionando para:', `${process.env.FRONTEND_URL}?auth=success`);
    res.redirect(`${process.env.FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error('Erro na autenticação:', error);
    const errorMessage = error.response?.data?.error_description || error.message;
    return res.redirect(`${process.env.FRONTEND_URL}?auth=error&reason=${encodeURIComponent(errorMessage)}`);
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

app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor está funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Configurações:');
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  console.log(`REDIRECT_URI: ${process.env.REDIRECT_URI}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
