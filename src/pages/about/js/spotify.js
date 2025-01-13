const BACKEND_URL = 'http://localhost:3000';

export function initSpotify() {
  const trackName = document.getElementById('track-name');
  const artistName = document.getElementById('artist-name');
  const spotifyLink = document.getElementById('spotify-link');

  async function getToken() {
    try {
      const response = await fetch(`${BACKEND_URL}/token`);
      if (!response.ok) {
        window.location.href = `${BACKEND_URL}/login`;
        return null;
      }
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Erro ao obter token:', error);
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
        return null;
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
        trackName.textContent = 'Lofi';
        artistName.textContent = '';
        spotifyLink.href = '#';
      }
    });
  }

  // Verificar parâmetros de URL após autenticação
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('auth') === 'success') {
    updateNowPlaying();
    // Limpar parâmetros da URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Atualizar a cada 30 segundos
  setInterval(updateNowPlaying, 30000);
  updateNowPlaying();
}
