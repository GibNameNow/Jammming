import "./ListElement.css";

const ListElement = (props) => {

    return (
        <div className="ListElement">
            <div className="content">
                <h2>{props.track.name}</h2>
                <br/>
                <div>
                    <h3>Made by:{props.track.artist} --- </h3> 
                    <h3>Album: {props.track.album}</h3>
                </div>
            </div>
            <button>+</button>
        </div>
    );
}

export default ListElement;