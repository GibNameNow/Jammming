import {useState} from "react";

import ListElement from "../ListElement/ListElement";
import "./SongList.css"

const SongList = (props) => {

    return (
        <div>
        {
            props.searchResults.map((track) => {
                return (
                    <ListElement track={track} onAdd={props.onAdd} onRemove={props.onRemove} isAddAction={props.isAddAction}/>
                );
            })
        }
        </div>
    );
}

export default SongList;