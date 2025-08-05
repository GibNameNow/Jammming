import { useCallback } from "react";
import "./ListElement.css";

const ListElement = (props) => {

    const triggerAction = useCallback((event) => {
        if(props.isAddAction){
            props.onAdd(props.track);
        } else {
            props.onRemove(props.track);
        }
        
    }, [props.addTrack, props.track, props.isAddAction]);

    const renderAction = () => {
        if(props.isAddAction){
            return (
                <button className="btn btn-circular btn-add" onClick={triggerAction}>+</button>
            );
        }
        return (
            <button className="btn btn-circular btn-remove" onClick={triggerAction}>-</button>
        );
    }

    return (
        <div className="ListElement">
            <div className="content">
                <h2>{props.track.name}</h2>
                {/* <br/> */}
                <div>
                    <h3>Made by:{props.track.artist} --- </h3> 
                    <h3>Album: {props.track.album}</h3>
                </div>
            </div>
            {renderAction()}
        </div>
    );
}

export default ListElement;