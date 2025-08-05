import { useCallback, useState } from 'react'
import './App.css'
import SearchBox from './Commponents/SearchBox/SearchBox'
import SongList from './Commponents/SongList/SongList'
import APICommunication from './api/APICommunication'

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [tracksPlaylist, setTracksPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [isPlaylistSelected, setIsPlaylistSelected] = useState(false);


  const search = useCallback ((searchTerm) => {
    APICommunication.search(searchTerm).then(setSearchResults);
  });

  const addTrack = useCallback((track) => {
    setTracksPlaylist((prevTracks) => [ ...prevTracks, track]);
  });

  const removeTrack = useCallback((trackToRemove) => {
    setTracksPlaylist((prevTracks) => 
      tracksPlaylist.filter((track) => track !== trackToRemove)
    );
  });

  const createPlaylist = useCallback(() => {
    if(!isPlaylistSelected){
      if(tracksPlaylist.length > 0){
        let uris = tracksPlaylist.map((track) => track.uri);
        if(playlistName === ''){
          throw new Error(`ListName Not set yet`);
        }
        APICommunication.createPlaylist(playlistName, uris);
        setIsPlaylistSelected(true);
      }
    } else {
      // APICommunication.updatePlaylistName(playlistName);
    }
  }, [playlistName, tracksPlaylist]);   //playlistName  muss hier included werden damit sichergestellt wird das die aktuellste value in der function geupdated wird.

  const updatePlaylistName = useCallback((event) => {
    console.log('NAME Will BE: ' + event.target.value);
    setPlaylistName(event.target.value);
    console.log('NAME IS: ' + App.playlistName);
  }, []); //GLAUB EMPTY LASSEN ---> TESTEN!

  return (
    <div>
      <header>
        <h1>Playlist Creator</h1>
        <SearchBox onSearch={search}></SearchBox>
      </header>
      <main>
        <div className='Lists'>
          <SongList searchResults={searchResults} onAdd={addTrack} isAddAction={true}></SongList>
          <SongList searchResults={tracksPlaylist} onRemove={removeTrack} isAddAction={false}></SongList>
        </div>
        
        {
          tracksPlaylist.length > 0 && (
            <div className='CreatePlaylist'> 
              <input className="PlaylistText" onChange={updatePlaylistName} type="text" />
              <button className='btn btn-square' onClick={createPlaylist}>Create/Update Playlist</button>
            </div>
          )
        }
      </main>
    </div>
  )
}

export default App;
