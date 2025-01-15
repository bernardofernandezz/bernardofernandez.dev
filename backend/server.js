const fastify = require('fastify')();
const PORT = process.env.PORT || 3000;

// Middleware para log
fastify.addHook('onRequest', (request, reply, done) => {
  console.log(
    `Server start: ${request.method} ${request.url} - Origin: ${request.headers.origin}`
  );
  done();
});

// Rota raiz
fastify.get('/', async (request, reply) => {
  return {
    status: 'ok',
    message: 'Servidor está online',
    endpoints: {
      test: '/test',
      spotify: '/spotify/now-playing',
    },
  };
});

// Rota de teste
fastify.get('/test', async (request, reply) => {
  return {
    status: 'ok',
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
  };
});

// Rota do Spotify
fastify.get('/spotify/now-playing', async (request, reply) => {
  try {
    // Simulação de dados do Spotify
    const nowPlayingData = {
      track: 'Shape of You',
      artist: 'Ed Sheeran',
      link: 'https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3',
      isPlaying: true,
      timestamp: new Date().toISOString(),
    };
    return nowPlayingData;
  } catch (error) {
    console.error('Erro ao buscar dados do Spotify:', error);
    reply.status(500).send({
      error: 'Erro ao buscar informações do Spotify',
      details: error.message,
    });
  }
});

// Iniciar servidor (apenas uma vez)
fastify.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = fastify;
