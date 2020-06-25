import React, { useState } from 'react';
import axios from 'axios';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import Map from './Map.js';
import InputBox from './InputBox.js';
import MerchantList from './MerchantList';
import industryCodes from './industryCodes.json';

function CardholderHome(props) {

    const [store, setStore] = useState('RESTAURANTS/BARS');
    const [zip, setZip] = useState('');
    const [showMerchants, setShowMerchants] = useState(false);
    const [loadingMerchants, setLoadingMerchants] = useState(false);
    const [merchants, setMerchants] = useState([]);

    function fetchMerchants() {
        setLoadingMerchants(true);
        let codes = industryCodes[store];
        console.log(`http://api.offerize.xyz/merchants?zipcode=${zip}&show=visa&industry=${codes}`);
        axios.get(`http://api.offerize.xyz/merchants?zipcode=${zip}&show=visa&industry=${codes}`)
            .then(res => {
                console.log(res);
                setShowMerchants(true);
                setLoadingMerchants(false);
                setMerchants(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <>
            <Header />
            <div className='headerText'>
                Find offers from your favorite local businesses.
            </div>
            <div style={{ position: 'relative', backgroundColor: '#f7fafc' }}>
                <Map merchants={merchants} />
                <div className='inputBox'>
                    <InputBox store={store} setStore={setStore} zip={zip} setZip={setZip}
                        fetchMerchants={fetchMerchants} loadingMerchants={loadingMerchants} />
                    {showMerchants && <MerchantList merchants={merchants} />}
                </div>
            </div>
            <div className='footerSpace' />
            <Footer />
        </>
    )
}

export default CardholderHome;

