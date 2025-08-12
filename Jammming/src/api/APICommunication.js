const client_id =  import.meta.env.VITE_CLIENT_ID;
const client_secret =  import.meta.env.VITE_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:3000';

let current_Playlist_id;
let accessToken = '';

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };
}

const APICommunication = {
  
  getAuthenticationCode(){
    if(!client_id || client_id ===''){
      throw new Error(' Client ID not correct: ' + client_id);
    }

    let authenticationURL = `https://accounts.spotify.com/authorize?`;
    authenticationURL += `client_id=${client_id}`;
    authenticationURL += `&response_type=code`;
    authenticationURL += `&scope=playlist-modify-public`;
    authenticationURL += `&redirect_uri=${redirect_uri}`;
    window.location = authenticationURL;
  },

  async requestAccessToken(){

    if(accessToken !== ''){
      return true;
    }

    const authCodeMatch = window.location.href.match(/code=([^&]*)/);

    if(!authCodeMatch){
      APICommunication.getAuthenticationCode();
    }

    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const encodedClientData = btoa(`${client_id}:${client_secret}`);

    const encodedBody = new URLSearchParams();
    encodedBody.append('code', authCodeMatch[1]);
    encodedBody.append('redirect_uri', redirect_uri);
    encodedBody.append('grant_type', 'authorization_code');

    return fetch(tokenEndpoint,{
      method: "POST",
      headers: {  
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedClientData}`
      },
      body: encodedBody,
    }).then(res => {
      if(!res.ok){        
        throw new Error(`Token request failed: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
        accessToken = data.access_token;
        const expiresIn = Number(data.expires_in);                                         
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return true;
    })
    .catch(err => console.error('Token request error:', err));
  },

  async search(searchTerm){
    const success = await APICommunication.requestAccessToken();
    
    if(success !== true){
      throw Error("FAILED to request AccessToken");
    }

    const requestEndpoint = `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`;

    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`},
    };

    return fetch(requestEndpoint, header).then(res => {
      return res.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      
      const simplifiedTracks = jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));

      return simplifiedTracks;
    });
  },

  createPlaylist(playlistName, playlistURIS) {

    return fetch(`https://api.spotify.com/v1/me`,{ headers: getAuthHeaders(),
    }).then(res => {
      if(!res.ok){        
        throw new Error(`request User ID failed: ${res.status}`);
      }
      return res.json();
    })
    .then(userID => {
        if (!playlistName || playlistName.trim() === "") {
          throw new Error("Playlist name is required");
        }

        //Create Playlist returns object containing Playlist ID needed for next fetch
        return fetch(`https://api.spotify.com/v1/users/${userID.id}/playlists`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ 
            name: playlistName,
            description: "Created with my app",
            public: true, 
          }),
        })
        .then(res => {
          if(!res.ok){        
            throw new Error(`request User ID failed: ${res.status}`);
          }
          return res.json();
        }).then(jsonResponse => {
          current_Playlist_id = jsonResponse.id;
          
          return fetch(`https://api.spotify.com/v1/playlists/${jsonResponse.id}/tracks`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({uris: playlistURIS})
          });
        })
      })
      .catch(err => console.error('Create/Update Playlist error:', err));
  },


  updatePlaylistName(newPlaylistName) {

    if(current_Playlist_id !== ''){
      let requestEndpoint = `https://api.spotify.com/v1/playlists/${current_Playlist_id}`;    

        return fetch(requestEndpoint, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ 
            name: newPlaylistName,
          }),
        })
        .catch(err => console.error('Token request error:', err));
    }
  }
}

export default APICommunication;


        
  