import {useCallback, useEffect, useState} from "react";

import "./SearchBox.css";

const SearchBox = (props) => {

    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        setSearchTerm(props.restoreSearchValue);
    }, []);

    const searchHandler = useCallback(() => {
        props.onSearch(searchTerm)
    }, [searchTerm]);

    const updateSearchTerm = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    return (
        <div className="SearchBox">
            <input id="SearchInput" type="text" placeholder="Enter Track here..." onChange={updateSearchTerm} value={searchTerm} />
            <button className="btn btn-square" onClick={searchHandler}>Search</button>
        </div>
    )
}

export default SearchBox;