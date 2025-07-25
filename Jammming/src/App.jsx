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
    APICommunication.setTracksPlaylist([])
  });

  return (
    <div>
      <header>
        <h1>Playlist Creator</h1>
        <SearchBox onSearch={search}></SearchBox>
      </header>
      <main>
        <div className='Lists'>
          <SongList searchResults={searchResults}></SongList>
          <SongList searchResults={searchResults}></SongList>
        </div>
      </main>
      
    </div>
  )
}

export default App;
