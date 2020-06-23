import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from 'antd';
import { SlidersFilled } from '@ant-design/icons';

const { Option } = Select;

const InputBox = (props) => {

    const [invalidZip, setInvalidZip] = useState(false);
    const [buttonShake, setButtonShake] = useState(false);

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
                    <Select value={props.store} style={{ width: '200px' }} size='large' onChange={val => props.setStore(val)}>
                        <Option value="restaurants">Restaurants</Option>
                        <Option value="bars">Bars</Option>
                        <Option value="dentists">Dentists</Option>
                    </Select>
                </div>
                <div className='inputBoxFieldsRow'>
                    Near
                    <Input className={invalidZip ? 'invalidZip' : ''} value={props.zip} onChange={event => props.setZip(event.target.value)}
                        placeholder='Zip code' style={{ width: '200px' }} size='large' />
                </div>
                <div className='inputBoxFieldsRow'>
                    <Button size='large'>
                        <SlidersFilled style={{ color: '#1890ff' }} />
                    </Button>
                    <Button className={['inputBoxSubmit', buttonShake ? 'buttonShake' : ''].join(' ')} style={{ width: '200px' }}
                        type='primary' size='large' onClick={onSubmit} loading={props.loadingMerchants} >
                        Search
                    </Button>
                </div>
            </div>
        </>
    )
}

export default InputBox;

