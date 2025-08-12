import {useCallback, useState} from "react";

import "./SearchBox.css";

const SearchBox = (props) => {

    const [searchTerm, setSearchTerm] = useState("");

    const searchHandler = useCallback(() => {
        console.log(searchTerm);
        props.onSearch(searchTerm)
    }, [searchTerm]);

    const updateSearchTerm = useCallback((e) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
    }, []);

    return (
        <div className="SearchBox">
            <input id="SearchInput" type="text" placeholder="Enter Track here..." onChange={updateSearchTerm} />
            <button className="btn btn-square" onClick={searchHandler}>Search</button>
        </div>
    )
}

export default SearchBox;