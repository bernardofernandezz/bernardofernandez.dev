const BACKEND_URL = 'https://bernardofernandez-backend-rifwtb92d.vercel.app';

export function initSpotify() {
  const trackName = document.getElementById('track-name');
  const artistName = document.getElementById('artist-name');
  const spotifyLink = document.getElementById('spotify-link');

  async function testBackendConnection() {
    try {
      const response = await fetch(`${BACKEND_URL}/test`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

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

  testBackendConnection();
}
