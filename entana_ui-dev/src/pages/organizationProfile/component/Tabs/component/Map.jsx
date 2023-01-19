import GoogleMapReact from "google-map-react";
import { useState } from "react";

const Marker = (props) => {
  const { name, passKey, address ,...location } = props;
  const [display, setDisplay] = useState(false)

  return (
    <div {...location}>
      <div onClick={() => setDisplay(true)}>
        <div className="pin"></div>
        <div className="pulse"></div>
      </div>
      <div
        className={"bg-white absolute w-80 left-6 p-2 rounded-xl border-sky-500"}
        style={{
          border: "solid 3px rgb(3 105 161)",
          display: display ? "block" : "none"
        }}>
        <div
          className={"absolute right-1 top-1 bg-slate-300 rounded-full w-5 h-5 text-center leading-5 text-xs "}
          onClick={() => setDisplay(false)}
        >X</div>
        <div className={"font-semibold text-xs"}>{name}</div> 
        {address}
      </div>
    </div>
  )
}

const DEFAULT_ZOOM = 5;
// const DEFAULT_CENTER = ;

const GooglMap = (props) => {

  const { markers, center } = props;

  return (
    <div className={"w-full h-full"}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_SERVER_GOOGLE_MAP_API_KEY }}
        defaultCenter={center}
        defaultZoom={DEFAULT_ZOOM}
      >
        {
          markers.map((passProps, idx) => <Marker {...passProps} key={idx} passKey={idx} />)
        }
      </GoogleMapReact>
    </div>
  )
}


export default function CustomMap(props) {

  const { locations } = props;

  if (locations === false) {
    return (
      <div className={"w-full h-96 bg-stone-100 p-3 rounded"}>  
        <p>Please contact license@entana.net for access to this view.</p>
      </div>
    )
  }

  const markers = locations.map(e => {
    return {
      lat: e.latitude,
      lng: e.longitude,
      name: e.name,
      address : e.address
    }
  })

  const center = locations.length ?
    {
      lat: locations[0].latitude,
      lng: locations[0].longitude

    } : {
      lat: 0,
      lng: 0
    }



  return (
    <div className={"w-full h-96"}>
      {
        locations.length ? <GooglMap center={center} markers={markers} /> : <p>No Factory</p>
      }
    </div>
  )
} 