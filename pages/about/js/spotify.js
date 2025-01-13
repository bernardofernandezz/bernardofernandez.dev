const BACKEND_URL = 'https://bernardofernandezdev.onrender.com';

export function initSpotify() {
  const trackName = document.getElementById('track-name');
  const artistName = document.getElementById('artist-name');
  const spotifyLink = document.getElementById('spotify-link');

  // Função para testar a conexão com o backend
  async function testBackendConnection() {
    try {
      const response = await fetch(`${BACKEND_URL}/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Backend connection test:', data);
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }

  async function getToken() {
    try {
      const isBackendAvailable = await testBackendConnection();
      if (!isBackendAvailable) {
        throw new Error('Backend não está disponível');
      }

      const response = await fetch(`${BACKEND_URL}/token`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Iniciando processo de autenticação...');
          sessionStorage.setItem('spotify_redirect', window.location.href);
          window.location.href = `${BACKEND_URL}/login`;
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Erro ao obter token:', error);
      trackName.textContent = 'Erro de conexão';
      artistName.textContent = 'Verifique se o servidor está rodando';
      return null;
    }
  }

  async function getCurrentlyPlaying() {
    const token = await getToken();
    if (!token) return null;

    try {
      const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        console.log('Nenhuma música tocando no momento');
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do Spotify:', error);
      return null;
    }
  }

  function updateNowPlaying() {
    getCurrentlyPlaying().then(data => {
      if (data && data.item) {
        trackName.innerHTML = `
          <div class="playing-animation">
            <span></span><span></span><span></span>
          </div>
          ${data.item.name}
        `;
        artistName.textContent = data.item.artists.map(artist => artist.name).join(', ');
        spotifyLink.href = data.item.external_urls.spotify;
      } else {
        trackName.textContent = 'Nenhuma música tocando';
        artistName.textContent = '';
        spotifyLink.href = '#';
      }
    });
  }

  // Verificar parâmetros de URL após autenticação
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'success') {
    console.log('Autenticação bem-sucedida!');
    updateNowPlaying();
    // Limpar parâmetros da URL mantendo o histórico
    const newUrl = window.location.pathname;
    window.history.pushState({}, document.title, newUrl);
  } else if (urlParams.get('auth') === 'error') {
    console.error('Erro na autenticação do Spotify:', urlParams.get('reason'));
    trackName.textContent = 'Erro na autenticação';
    artistName.textContent = 'Tente novamente mais tarde';
  }

  // Atualizar a cada 30 segundos
  setInterval(updateNowPlaying, 30000);
  updateNowPlaying();
}
