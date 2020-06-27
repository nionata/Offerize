import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// If you want to use the provided css
import 'react-google-places-autocomplete/dist/index.min.css';

const Autocomplete = () => {

    return (
        <div>
            <GooglePlacesAutocomplete
                apiKey='AIzaSyD-f71Ghi91GVwaNecmAtv_eIsaFOf3p5M'
                onSelect={() => console.log('hi')}
            />
        </div>
    )
};

export default Autocomplete;