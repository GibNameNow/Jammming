import React, {useCallback, useState} from "react";

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
            <h1>TEST</h1>
            <input id="SearchInput" type="text" placeholder="Enter Artist please...!!" onChange={updateSearchTerm} />
            <input id="submit" type="submit" onClick={searchHandler}/>
        </div>
    )
}

export default SearchBox;