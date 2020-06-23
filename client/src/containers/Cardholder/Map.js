import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    // view height minus (header and footer)
    height: 'calc(100vh - 80px - 60px)'
};

const Map = (props) => {

    // The things we need to track in state
    const [mapRef, setMapRef] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [markerMap, setMarkerMap] = useState({});
    const [center, setCenter] = useState({ lat: 39.8097343, lng: -98.5556199 }); //center of US
    const [zoom, setZoom] = useState(5);
    const [clickedLatLng, setClickedLatLng] = useState(null);
    const [infoOpen, setInfoOpen] = useState(false);

    useEffect(() => {
        fitBounds(mapRef);
    }, [props.merchants]);

    const loadHandler = map => {
        // Store a reference to the google map instance in state
        setMapRef(map);
        // Fit map bounds to contain all markers
        fitBounds(map);
    }

    // Iterate merchants to size, center, and zoom map to contain all markers
    const fitBounds = map => {
        // default map loads at the center of the US
        if (props.merchants === undefined || props.merchants.length == 0) {
            return;
        }
        const bounds = new window.google.maps.LatLngBounds();
        props.merchants.map(place => {
            bounds.extend(place.pos);
            return place.id;
        });
        map.fitBounds(bounds);
    };

    // We have to create a mapping of our places to actual Marker objects
    const markerLoadHandler = (marker, place) => {
        return setMarkerMap(prevState => {
            return { ...prevState, [place.id]: marker };
        });
    };

    const markerClickHandler = (event, place) => {
        // Remember which place was clicked
        setSelectedPlace(place);

        // Required so clicking a 2nd marker works as expected
        if (infoOpen) {
            setInfoOpen(false);
        }

        setInfoOpen(true);

        // to zoom in a little on marker click
        // if (zoom < 13) {
        //     setZoom(13);
        // }

        // to center the selected Marker
        //setCenter(place.pos)
    };

    return (
        <LoadScript
            googleMapsApiKey='AIzaSyD-f71Ghi91GVwaNecmAtv_eIsaFOf3p5M'
        >
            <GoogleMap
                onLoad={loadHandler}
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
            // Save the current center position in state
            // onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
            // Save the user's map click position
            // onClick={e => setClickedLatLng(e.latLng.toJSON())}
            >
                <>
                    {props.merchants.map(place => (
                        <Marker
                            key={place.id}
                            position={place.pos}
                            onLoad={marker => markerLoadHandler(marker, place)}
                            onClick={event => markerClickHandler(event, place)}
                        />
                    ))}
                    {infoOpen && selectedPlace && (
                        <InfoWindow
                            anchor={markerMap[selectedPlace.id]}
                            onCloseClick={() => setInfoOpen(false)}
                        >
                            <div>
                                <h3>{selectedPlace.id}</h3>
                                <div>Some content about the location</div>
                            </div>
                        </InfoWindow>
                    )}

                </>
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(Map)


// Custom marker icon:
// icon={{
//     path:
//         "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
//     fillColor: "#0000ff",
//     fillOpacity: 1.0,
//     strokeWeight: 0,
//     scale: 1.25
// }}