const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração básica
app.use(express.json());

// Configuração CORS simplificada
app.use(cors({
  origin: 'https://bernardofernandezz.github.io',
  credentials: true
}));

// Rota de teste
app.get('/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend está funcionando'
  });
});

// ... resto do código ...

module.exports = app;
