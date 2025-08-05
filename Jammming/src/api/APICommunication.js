import React from "react";

const client_id =  import.meta.env.VITE_CLIENT_ID;
const client_secret =  import.meta.env.VITE_CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:3000';

let accessToken = '';

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
    // authenticationURL += `&state=${state}`;
    window.location = authenticationURL;
  },

  async requestAccessToken(){

    if(accessToken !== ''){
      return accessToken;
    }

    const authCodeMatch = window.location.href.match(/code=([^&]*)/);
    // const stateMatch = window.location.href.match(/state=([^&]*)/);   

    if(!authCodeMatch){
      APICommunication.getAuthenticationCode();
    }

    //TODO: error-handeling

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
      }
      )
      .catch(err => console.error('Token request error:', err));
      return true;
  },

    async search(searchTerm){
      const finished = await APICommunication.requestAccessToken();
      // if(!finished){
      //   console.log('FAIL BUT VAL IS: ' + accessToken);
      //   throw Error("FAILED TEST" + finished);
      // }
      // else{
      //   console.log('SUCCESS TEST: ' + accessToken);
      // }

      console.log("AccessTOken: " + accessToken);  
      if(accessToken === ''){
        throw new Error("Failed to get Accestoken");
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

    // BSP-------->   {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M", "spotify:episode:512ojhOuo1ktJprKbVcKyQ"]}
    const headerData = { Authorization: `Bearer ${accessToken}`};
    const headerDataTest = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'};

    return fetch(`https://api.spotify.com/v1/me`,{ headers: headerData,
    }).then(res => {
      if(!res.ok){        
        throw new Error(`request User ID failed: ${res.status}`);
      }
      return res.json();
    })
    .then(userID => {
        console.log('USER ID RETRIVED: ' + userID.id + ' PLAYLIST NAME: ' + playlistName);
        if (!playlistName || playlistName.trim() === "") {
          throw new Error("Playlist name is required");
        }
        //Create Playlist returns object containing Playlist ID needed for next fetch
        return fetch(`https://api.spotify.com/v1/users/${userID.id}/playlists`, {
          method: "POST",
          headers: headerDataTest,
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
          return fetch(`https://api.spotify.com/v1/playlists/${jsonResponse.id}/tracks`, {
            method: "POST",
            headers: headerData,
            body: JSON.stringify({uris: playlistURIS})
          });
          
        }
        )
      })
      .catch(err => console.error('Create/Update Playlist error:', err));
  }


  // updatePlaylist() {
  //   const requestEndpoint = `https://api.spotify.com/v1/playlists/${playlist_id}`;

    
  // }
}

export default APICommunication;


        
  