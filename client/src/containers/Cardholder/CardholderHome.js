import React, { useState } from 'react';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import Map from './Map.js';
import InputBox from './InputBox.js';
import MerchantList from './MerchantList';

function CardholderHome(props) {

    const [store, setStore] = useState('restaurants');
    const [zip, setZip] = useState('');
    const [showMerchants, setShowMerchants] = useState(false);
    const [loadingMerchants, setLoadingMerchants] = useState(false);
    const [merchants, setMerchants] = useState([]);

    function fetchMerchants() {
        console.log('search!!');
        setLoadingMerchants(true);
        // some api call
        // .then() =>
        setTimeout(() => {
            setShowMerchants(true);
            setLoadingMerchants(false);
            setMerchants([
                { id: "Sbarro", pos: { lat: 39.09366509575983, lng: -94.58751660204751 }, desc: 'A classic New York slice.' },
                { id: "Pizza by Alfredo", pos: { lat: 39.10894664788252, lng: -94.57926449532226 }, desc: 'A hot circle of garbage.' },
                { id: "Alfredo's Pizza Cafe", pos: { lat: 39.07602397235644, lng: -94.5184089401211 }, desc: 'Superior in quality and taste.' },
                { id: "Sbarro", pos: { lat: 39.09366509575983, lng: -94.58751660204751 }, desc: 'A classic New York slice.' },
                { id: "Pizza by Alfredo", pos: { lat: 39.10894664788252, lng: -94.57926449532226 }, desc: 'A hot circle of garbage.' },
                { id: "Alfredo's Pizza Cafe", pos: { lat: 39.07602397235644, lng: -94.5184089401211 }, desc: 'Superior in quality and taste.' },
                { id: "Sbarro", pos: { lat: 39.09366509575983, lng: -94.58751660204751 }, desc: 'A classic New York slice.' },
                { id: "Pizza by Alfredo", pos: { lat: 39.10894664788252, lng: -94.57926449532226 }, desc: 'A hot circle of garbage.' },
                { id: "Alfredo's Pizza Cafe", pos: { lat: 39.07602397235644, lng: -94.5184089401211 }, desc: 'Superior in quality and taste.' }
            ]);
        }, 2000);
    }

    return (
        <>
            <Header />
            <div style={{ position: 'relative' }}>
                <Map merchants={merchants} />
                <div className='inputBox'>
                    <InputBox store={store} setStore={setStore} zip={zip} setZip={setZip}
                        fetchMerchants={fetchMerchants} loadingMerchants={loadingMerchants} />
                    {showMerchants && <MerchantList merchants={merchants} />}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CardholderHome;

