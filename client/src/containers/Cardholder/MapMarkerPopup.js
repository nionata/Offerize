import React, { useState } from 'react';

import { InfoWindow } from '@react-google-maps/api';


import parseDate from './parseDate';
import MerchantModal from './MerchantModal';

const MapMarkerPopup = (props) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <MerchantModal showModal={showModal} setShowModal={setShowModal} item={props.selectedPlace} idx={Math.random() * 1000000} />
            <InfoWindow
                anchor={props.anchor}
                onCloseClick={() => props.setInfoOpen(false)}
            >
                <div>
                    <h3>{props.selectedPlace.name}</h3>
                    <div>{Math.round(10 * props.selectedPlace.distance) / 10 + ' miles away'}</div>
                    <div>{parseDate(props.selectedPlace.timings)}</div>
                    <u className='mapMarkerMoreInfo' onClick={() => setShowModal(true)}>More info</u>
                </div>
            </InfoWindow>
        </>
    )
}

export default MapMarkerPopup;