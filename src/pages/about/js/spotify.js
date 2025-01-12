const CLIENT_ID = '2209647ec74e44d1b4c365560c408de2';
const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPES = 'user-read-currently-playing';
const CLIENT_SECRET = '5aa012c30e134f12a0a5ceb697b8cede';

async function getCurrentlyPlaying() {
  const token = localStorage.getItem('BQBFiGVTR07vekCsLbTCAkI6DdsaxXjgzgx3bRtJtXNPcKV9WU9txL3Rs8mWTzV7Vf1o5ilBooRZ2Q1QwDc5XzFCFMNMVyAZtRToTVYSULeIA3sVQVA');
  if (!token) return null;

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 204) {
      return null; // No track playing
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return null;
  }
}

function updateNowPlaying() {
  getCurrentlyPlaying().then(data => {
    const trackName = document.getElementById('track-name');
    const artistName = document.getElementById('artist-name');
    const spotifyLink = document.getElementById('spotify-link');

    if (data && data.item) {
      trackName.textContent = data.item.name;
      artistName.textContent = data.item.artists.map(artist => artist.name).join(', ');
      spotifyLink.href = data.item.external_urls.spotify;
    } else {
      trackName.textContent = 'Not playing';
      artistName.textContent = '';
      spotifyLink.href = '#';
    }
  });
}

// Update every 30 seconds
setInterval(updateNowPlaying, 30000);
updateNowPlaying();

// Handle Spotify authentication
function login() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) {
    // Redirect to Spotify login
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`;
    window.location.href = authUrl;
  } else {
    // Exchange code for token (You'll need a backend for this part)
    // For security reasons, token exchange should be done server-side
  }
}
