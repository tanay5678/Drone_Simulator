import React, { useState } from "react";
import { Marker, Source, Layer } from "react-map-gl";
import { HiLocationMarker } from "react-icons/hi";
import { GiDeliveryDrone } from "react-icons/gi";

const Map = () => {
  const [sLng, setSLng] = useState()
  const [sLat, setSLat] = useState()
  const [dLng, setDLng] = useState()
  const [dLat, setDLat] = useState()
  const [run, setRun] = useState(false)

  const lineLayer = {
    id: "path",
    type: "line",
    source: "path",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#000000",
      "line-opacity": 0.5,
      "line-width": 3,
    },
  };
  let sourceCoordinates = [sLng, sLat]
  let destinationCoordinates = [dLng, dLat]
  const [droncrods, setDroncrods] = useState({
    latitude: sourceCoordinates[1],
    longitude: sourceCoordinates[0],
  });
  const [speed, setSpeed] = useState(10)
  const [intervalID, setIntervalID] = useState(null)

  const pathCoordinates = [sourceCoordinates, destinationCoordinates];
  const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  };
  const calDistance = (source, dest) => {
    const [lng1, lat1] = [source.longitude, source.latitude];
    const [lng2, lat2] = dest;
    const earthR = 6371;
    const dLat = degreesToRadians(lat2 - lat1);
    const dLng = degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthR * c;
    return distance;
  };

  const startAnimate = (speed) => {
    // console.log(speed)
    const steps = speed
    const latINC = (destinationCoordinates[1] - sourceCoordinates[1]) / steps
    const lngINC = (destinationCoordinates[0] - sourceCoordinates[0]) / steps
    let distance = calDistance(droncrods, destinationCoordinates)
    let duration = (distance / steps) * 6000
    let step = 0
    let newInterval = setInterval(() => {
      // console.log('Interval Started')
      if (step <= steps) {
        console.log(step)
        //data is updating here 
        setDroncrods((prev) => ({
          latitude: prev.latitude + latINC,
          longitude: prev.longitude + lngINC
        }))
        step++;
      }
      else {
        // console.log('Reached..')
        clearInterval(newInterval)
      }
      // console.log('New Co-ordinates', droncrods)
      setIntervalID(newInterval)
    }, duration);
  }
  const handleSimulate = () => {
    if (sLng && sLat && dLng && dLat) {
      setRun(true)
      setDroncrods({
        latitude: sourceCoordinates[1],
        longitude: sourceCoordinates[0],
      });
      startAnimate(speed)
    }
    else {
      alert('Fill all data')
    }
  }
  const stop = () => {
    clearInterval(intervalID)

  }
  const reset = () => {
    setRun(false)
    setDroncrods({
      latitude: sLat,
      longitude: sLng
    })
    console.log(droncrods)
  }
  console.log(run)
  return (
    <div className="map">
      <div className="form">
        <div className="data">
          <input type="text" placeholder="Source Longitude" onChange={(e) => setSLng(parseFloat(e.target.value))} />
          <input type="text" placeholder="Source Latitude" onChange={(e) => setSLat(parseFloat(e.target.value))} />
          <input type="text" placeholder="Destination Longitude" onChange={(e) => setDLng(parseFloat(e.target.value))} />
          <input type="text" placeholder="Destination Latitude" onChange={(e) => setDLat(parseFloat(e.target.value))} />
          <input type="range" placeholder="Speed (10-100)" value={speed} onChange={(e) => setSpeed(e.target.value)} step={10} min={10} max={100} />
          <div>
            <span>Speed:</span>{speed}
          </div>
        </div>
        <div className="btn">
          <button onClick={() => handleSimulate()}>Simulate</button>
          <button onClick={() => stop()}>Stop</button>
          <button onClick={() => reset()}>Reset</button>
        </div>
      </div>

      {
        run ?
          <>
            <Marker
              latitude={sourceCoordinates[1]}
              longitude={sourceCoordinates[0]}

            >
              <div className="source_marker">
                <HiLocationMarker className="marker" />
              </div>
            </Marker>
            {/* Drone Marker */}
            <Marker
              latitude={droncrods.latitude}
              longitude={droncrods.longitude}
              anchor="left"
            >
              <div className="source_drone">
                <GiDeliveryDrone className="marker" />
              </div>
            </Marker>
            {/* Destination Marker */}
            <Marker
              latitude={destinationCoordinates[1]}
              longitude={destinationCoordinates[0]}
            >
              <div className="dest_marker">
                <HiLocationMarker className="marker" />
              </div>
            </Marker>

            {/* Drawing line between two markers */}
            <Source
              id="path"
              type="geojson"
              data={{
                type: "Feature",
                geometry: { type: "LineString", coordinates: pathCoordinates },
              }}
            >
              <Layer {...lineLayer} />
            </Source>
          </> : <>
          </>
      }
    </div >
  );
};

export default Map;
