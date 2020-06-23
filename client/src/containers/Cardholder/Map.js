import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: 'calc(100vh - 80px - 60px)'
};

// Default to middle of US
const center = {
    lat: 39.8097343,
    lng: -98.5556199
};

const Map = (props) => {
    return (
        <LoadScript
            googleMapsApiKey='AIzaSyD-f71Ghi91GVwaNecmAtv_eIsaFOf3p5M'
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
            >
                <>

                </>
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(Map)