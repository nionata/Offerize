import React, { useState } from 'react';
import axios from 'axios';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import Map from './Map.js';
import InputBox from './InputBox.js';
import MerchantList from './MerchantList';
import industryCodes from './industryCodes.json';
import tempData from './tempData.json';
import useScript from '../../hooks/useScript';


function CardholderHome(props) {

    // useScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyD-f71Ghi91GVwaNecmAtv_eIsaFOf3p5M&libraries=places');

    const [store, setStore] = useState('RESTAURANTS/BARS');
    const [location, setLocation] = useState(null);
    const [showMerchants, setShowMerchants] = useState(false);
    const [loadingMerchants, setLoadingMerchants] = useState(false);
    const [merchants, setMerchants] = useState([]);
    const [address, setAddress] = useState('');

    function fetchMerchants() {
        // setMerchants(tempData);
        console.log(location);
        setLoadingMerchants(true);
        let codes = industryCodes[store];
        axios.get(`http://api.offerize.xyz/merchants?zipcode=20740&show=visa&industry=${codes}`)
            .then(res => {
                console.log(res);
                setShowMerchants(true);
                setLoadingMerchants(false);
                let listOfMerchants = []
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
                        address: address
                    })
                })
                setMerchants(listOfMerchants);
                console.log(listOfMerchants);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleChange = address => {
        setAddress(address);
    };

    const handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));
    };

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
            {/* <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete> */}
            <div className='footerSpace' />
            <Footer />
        </>
    )
}

export default CardholderHome;

