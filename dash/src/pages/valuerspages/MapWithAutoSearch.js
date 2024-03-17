import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import { setGpsDetails, selectGPSDetails } from "../../featuers/authSlice";

const MapWithAutoSearch = () => {
  const gpsd = useSelector(selectGPSDetails);
  let defaultLong = -1.22468;
  let defaultLat = 36.89925;
  const [center, setCenter] = useState({ lat: defaultLat, lng: defaultLong });
  useEffect(() => {
    if (gpsd != null) {
      if (gpsd.type === "custom") {
        console.log(gpsd);
        defaultLong = gpsd?.details?.long;
        defaultLat = gpsd?.details?.lat;
        setCenter({ lat: defaultLat, lng: defaultLong });
      } else if (gpsd.type === "auto") {
        console.log(gpsd?.details?.long);
        defaultLong = gpsd?.details?.long;
        defaultLat = gpsd?.details?.lat;
        setCenter({ lat: defaultLat, lng: defaultLong });
      }
    }
  }, [gpsd]);

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const autocompleteRef = useRef(null);
  const dispatch = useDispatch();

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      console.log(place);
      if (place.geometry) {
        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        dispatch(
          setGpsDetails({
            type: "auto",
            details: {
              lat: place.geometry.location.lat(),
              long: place.geometry.location.lng(),
              name: place.address_components[1]?.long_name,
              formatted_address: place.geometry.formatted_address,
            },
          })
        );
        setSelectedPlace(place);
      }
    }
  };

  const onMapClick = (event) => {
    console.log(event);
    const place = autocompleteRef.current.getPlace();
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    // const formatedname = formatted_address

    dispatch(
      setGpsDetails({
        type: "auto",
        details: {
          lat: place.geometry.location.lat(),
          long: place.geometry.location.lng(),
          name: "Custom Picked Name",
          formatted_address: "Custom Picked Name",
        },
      })
    );
    setSelectedPlace({
      name: `Custom Picked Name`,
      geometry: {
        location: {
          lat: () => latitude,
          lng: () => longitude,
        },
      },
    });

    // Clear previously set markers and add the new marker for the selected location
    setMarkers([
      {
        name: "Custom Location",
        position: { lat: latitude, lng: longitude },
        icon: "https://maps.google.com/mapfiles/kml/paddle/blu-circle.png", // Custom icon for selected place marker
      },
    ]);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBjVd1WBin9lU7BW0N0AujyyL0jMGKgkQ4" libraries={["places"]}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "200px" }} center={center} zoom={15} onClick={onMapClick}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.icon} onClick={() => setSelectedPlace(marker)} />
        ))}

        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter a location"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `500px`,
              height: `50px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
              marginTop: "5px",
            }}
          />
        </Autocomplete>
      </GoogleMap>
      {gpsd != null && (
        <div style={{ marginTop: "10px" }}>
          <h2>Selected Location:</h2>
          <p>Name: {gpsd?.details?.name}</p>
          {/* <p>Conty: {selectedPlace?.address_components[1]?.long_name}</p>
          <p>Formated Place: {selectedPlace.formatted_address}</p> */}
          <p>Latitude: {gpsd?.details?.lat}</p>
          <p>Longitude: {gpsd?.details?.long}</p>
        </div>
      )}
    </LoadScript>
  );
};

export default MapWithAutoSearch;
