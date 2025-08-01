import { useCallback, useState } from 'react'
import './App.css'
import SearchBox from './Commponents/SearchBox/SearchBox'
import SongList from './Commponents/SongList/SongList'
import APICommunication from './api/APICommunication'

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [tracksPlaylist, setTracksPlaylist] = useState([]);


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
      </main>
    </div>
  )
}

export default App;
