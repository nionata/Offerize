import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

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
    const [sortBy, setSortBy] = useState(null);

    function fetchMerchants() {
        // setMerchants(tempData);
        setLoadingMerchants(true);
        let codes = industryCodes[store];
        axios.get(`/merchants?lat=${location.lat}&industry=${codes}&lon=${location.lng}&show=all`)
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
                setLoadingMerchants(false);
                message.error('Network error. Please try again later.')
                console.log(error);
            });
    }

    function onChangeSort(e) {
        setSortBy(e.target.value);
        // sort by distance
        if (e.target.value === 1) {
            setMerchants([...merchants].sort((a, b) => a.distance - b.distance));
        }
        // sort by rating
        else if (e.target.value === 2) {
            function compare(a, b) {
                // sort in descending, null rating are sent to the bottom
                a = a || 0;
                b = b || 0;
                return b.rating - a.rating;
            }
            setMerchants([...merchants].sort(compare));
        }
        // sort by name (alphabetical)
        else {
            function compare(a, b) {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();
                // sort ascending (a -> z)
                if (nameA < nameB)
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0;
            }
            setMerchants([...merchants].sort(compare));
        }
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
                    <InputBox store={store} setStore={setStore} setLocation={setLocation} location={location} showMerchants={showMerchants}
                        fetchMerchants={fetchMerchants} loadingMerchants={loadingMerchants} sortBy={sortBy} onChangeSort={onChangeSort} />
                    {showMerchants && <MerchantList merchants={merchants} />}
                </div>
            </div>
            <div className='footerSpace' />
            <Footer />
        </>
    )
}

export default CardholderHome;

