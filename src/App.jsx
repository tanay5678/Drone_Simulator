import { useState } from "react";
import "./App.css";
import Map from "./Components/Map";
import ReactMapGL, { NavigationControl } from "react-map-gl";

function App() {
  // console.log(process.env.REACT_APP_TOKEN)
  const TOKEN = process.env.REACT_APP_TOKEN
  const sourceCoordinates = [73.844131, 18.526110];
  // const destinationCoordinates = [73.786766, 18.559004];
  const [viewport, setViewport] = useState({
    latitude: sourceCoordinates[1],
    longitude: sourceCoordinates[0],
    zoom: 11,
  });
  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <ReactMapGL
        {...viewport}
        mapboxAccessToken={TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={(evt) => setViewport(evt.viewport)}
      >
        {/* Marker details */}
        <Map />
        {/* Top Right Navigation Control */}
        <div style={{ position: "absolute", right: 10, top: 10 }}>
          <NavigationControl />
        </div>
      </ReactMapGL>
    </div>
  );
}

export default App;
