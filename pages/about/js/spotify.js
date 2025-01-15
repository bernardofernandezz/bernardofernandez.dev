const BACKEND_URL = 'https://bernardofernandez-backend-23c16a7n8.vercel.app';

export function initSpotify() {
  const trackName = document.getElementById('track-name');
  const artistName = document.getElementById('artist-name');
  const spotifyLink = document.getElementById('spotify-link');

  async function testBackendConnection() {
    try {
      console.log('Testando conexão com:', BACKEND_URL);
      const response = await fetch(`${BACKEND_URL}/test`, {
        method: 'GET',
        mode: 'cors'
      });

      console.log('Status da resposta:', response.status);
      const data = await response.json();
      console.log('Dados recebidos:', data);

      return true;
    } catch (error) {
      console.error('Erro na conexão:', error);
      return false;
    }
  }

  testBackendConnection();
}
