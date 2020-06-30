import React, { useState } from 'react'
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from 'antd';

const libraries = ["places"];

const AutocompleteComponent = (props) => {

    const [autocomplete, setAutocomplete] = useState(null);
    const [text, setText] = useState('');
    const [address, setAddress] = useState(null);

    const onLoad = (autocomplete) => {
        // console.log('autocomplete: ', autocomplete)
        setAutocomplete(autocomplete);
    }

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            console.log(autocomplete.getPlace());
            setText(autocomplete.getPlace().formatted_address);
            setAddress(autocomplete.getPlace().formatted_address);
            props.setEdited(false);
            props.setLocation({
                lat: autocomplete.getPlace().geometry.location.lat(),
                lng: autocomplete.getPlace().geometry.location.lng()
            })
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <LoadScript
                googleMapsApiKey='AIzaSyD-f71Ghi91GVwaNecmAtv_eIsaFOf3p5M'
                libraries={libraries}
            >
                <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                >
                    <Input
                        className={['inputBoxComponent', props.invalidZip ? 'invalidZip' : ''].join(' ')}
                        value={text}
                        onChange={event => {
                            props.setEdited(true);
                            return setText(event.target.value);
                        }}
                        placeholder="Address or zip code"
                        style={{ float: 'right' }}
                    />
                </Autocomplete>
            </LoadScript>
        </div>
    )
}

export default React.memo(AutocompleteComponent);