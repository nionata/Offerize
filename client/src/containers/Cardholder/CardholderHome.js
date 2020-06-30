import React, { useState } from 'react';
import axios from 'axios';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import Map from './Map.js';
import InputBox from './InputBox.js';
import MerchantList from './MerchantList';
import industryCodes from './industryCodes.json';
import tempData from './tempData.json';


function CardholderHome(props) {

    const [store, setStore] = useState('RESTAURANTS/BARS');
    const [location, setLocation] = useState(null);
    const [showMerchants, setShowMerchants] = useState(false);
    const [loadingMerchants, setLoadingMerchants] = useState(false);
    const [merchants, setMerchants] = useState([]);
    const [address, setAddress] = useState('');

    function fetchMerchants() {
        // setMerchants(tempData);
        setLoadingMerchants(true);
        let codes = industryCodes[store];
        axios.get(`http://api.offerize.xyz/merchants?lat=${location.lat}&industry=${codes}&lon=${location.lng}&show=all`)
            .then(res => {
                console.log(res);
                setShowMerchants(true);
                setLoadingMerchants(false);
                let listOfMerchants = [];
                res.data.forEach(elem => {
                    let name = elem.name.toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
                    name = name.replace(/&amp;/g, '&');
                    let city = elem.city.toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
                    let address = elem.address.toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
                    listOfMerchants.push({
                        ...elem,
                        name: name,
                        city: city,
                        address: address,
                        zipcode: String(elem.zipcode),
                        lat: parseFloat(elem.lat),
                        lon: parseFloat(elem.lon)
                    })
                })
                setMerchants(listOfMerchants);
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
                    <InputBox store={store} setStore={setStore} setLocation={setLocation} location={location}
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

