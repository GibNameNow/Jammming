import React from "react";

const redirect_uri = 'http://127.0.0.1:3000';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

let accessToken = '';

const APICommunication = {
  
  getAuthenticationCode(){

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



}

export default APICommunication;


    