import React from 'react';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import Map from './Map.js';
import InputBox from './InputBox.js';

function CardholderHome(props) {

    function selectChange() {
    }

    return (
        <>
            <Header />
            <div style={{ position: 'relative' }}>
                <Map />
                <InputBox />
            </div>
            <Footer />
        </>
    )
}

export default CardholderHome;

