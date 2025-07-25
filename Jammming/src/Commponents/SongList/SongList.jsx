import React, {useState} from "react";

import ListElement from "../ListElement/ListElement";
import "./SongList.css"

const SongList = (props) => {

    return (
        <div>
        {
            props.searchResults.map((track) => {
                return (
                    <ListElement track={track}/>
                );
            }
            )
        }
        </div>
    );
}

export default SongList;