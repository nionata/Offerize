import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Popover, Radio } from 'antd';
import { SlidersFilled } from '@ant-design/icons';

import useWindowDimensions from './../../hooks/useWindowDimensions';
import Autocomplete from './Autocomplete';

const { Option } = Select;

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

const InputBox = (props) => {

    const [invalidZip, setInvalidZip] = useState(false);
    const [buttonShake, setButtonShake] = useState(false);
    const [sortBy, setSortBy] = useState(null);
    const { height, width } = useWindowDimensions();
    const [edited, setEdited] = useState(false);

    function onSubmit() {
        console.log(edited);
        // stops button click spam
        if (buttonShake || props.loadingMerchants)
            return;
        // if the zip is all digits and 5 digits long
        // if (/^\d+$/.test(props.zip) && props.zip.length === 5) {
        //     setInvalidZip(false);
        //     props.fetchMerchants();
        // }
        if (props.location !== null && !edited) {
            setInvalidZip(false);
            props.fetchMerchants();
        } else {
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
                    <Select className='inputBoxComponent' value={props.store} size={width > 800 ? 'middle' : 'middle'}
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
                    <Autocomplete invalidZip={invalidZip} setLocation={props.setLocation} setEdited={setEdited} />
                </div>
                <div className='inputBoxFieldsRow'>
                    <Popover placement="right" trigger="click"
                        content={
                            <>
                                Sort by
                                <br />
                                <Radio.Group onChange={e => setSortBy(e.target.value)} value={sortBy}>
                                    <Radio style={radioStyle} value={1}>
                                        Distance
                                    </Radio>
                                    <Radio style={radioStyle} value={2}>
                                        Rating
                                    </Radio>
                                    <Radio style={radioStyle} value={3}>
                                        Name
                                    </Radio>
                                </Radio.Group>
                            </>
                        }>
                        <Button size={width > 800 ? 'middle' : 'middle'}>
                            <SlidersFilled style={{ color: '#1890ff' }} />
                        </Button>
                    </Popover>
                    <Button className={['inputBoxSubmit', 'inputBoxComponent', buttonShake ? 'buttonShake' : ''].join(' ')}
                        type='primary' size={width > 800 ? 'middle' : 'middle'}
                        onClick={onSubmit} loading={props.loadingMerchants} >
                        Search
                    </Button>
                </div>
            </div>
        </>
    )
}

export default InputBox;

