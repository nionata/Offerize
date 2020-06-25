import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from 'antd';
import { SlidersFilled } from '@ant-design/icons';

import useWindowDimensions from './../../hooks/useWindowDimensions';

const { Option } = Select;

const InputBox = (props) => {

    const [invalidZip, setInvalidZip] = useState(false);
    const [buttonShake, setButtonShake] = useState(false);
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { height, width } = useWindowDimensions();

    function onSubmit() {
        // stops button click spam
        if (buttonShake || props.loadingMerchants)
            return;
        // if the zip is all digits and 5 digits long
        if (/^\d+$/.test(props.zip) && props.zip.length === 5) {
            setInvalidZip(false);
            props.fetchMerchants();
        }
        else {
            setInvalidZip(true);
            setButtonShake(true);
            setTimeout(() => {
                setButtonShake(false);
            }, 700);
        }
    }

    return (
        <>
            <div className='inputBoxHeader'>
                Find offers from your favorite local businesses.
            </div>
            <div className='inputBoxFields'>
                <div className='inputBoxFieldsRow'>
                    Find
                    <Select className='inputBoxComponent' value={props.store} size={width > 800 ? 'large' : 'middle'}
                        onChange={val => props.setStore(val)}>
                        <Option value='RESTAURANTS/BARS'>Restaurants + Bars</Option>
                        <Option value='AUTO RENTAL'>Auto Rental</Option>
                        <Option value='BARBER/BEAUTY SHOPS'>Barbers + Beauty</Option>
                        <Option value='HOTELS & MOTELS'>Hotels</Option>
                        <Option value='LAUNDRY/CLEANING/GARMENT & SHOE REPAIR'>Laundry + Garment</Option>
                        <Option value='GROCERY STORES/SUPERMARKETS/BAKERIES'>Groceries + Bakeries</Option>
                        <Option value='HARDWARE/PAINT/GLASS'>Hardware</Option>
                    </Select>
                </div>
                <div className='inputBoxFieldsRow'>
                    Near
                    <Input className={['inputBoxComponent', invalidZip ? 'invalidZip' : ''].join(' ')} value={props.zip} onChange={event => props.setZip(event.target.value)}
                        placeholder='Zip code' size={width > 800 ? 'large' : 'middle'} />
                </div>
                <div className='inputBoxFieldsRow'>
                    <Button size={width > 800 ? 'large' : 'middle'}>
                        <SlidersFilled style={{ color: '#1890ff' }} />
                    </Button>
                    <Button className={['inputBoxSubmit', 'inputBoxComponent', buttonShake ? 'buttonShake' : ''].join(' ')}
                        type='primary' size={width > 800 ? 'large' : 'middle'}
                        onClick={onSubmit} loading={props.loadingMerchants} >
                        Search
                    </Button>
                </div>
            </div>
        </>
    )
}

export default InputBox;

