import React, { useState } from 'react';
import { Input, Select, Button } from 'antd';
import { SlidersFilled } from '@ant-design/icons';

const { Option } = Select;

const InputBox = (props) => {

    const [store, setStore] = useState('restaurants');
    const [zip, setZip] = useState('');
    const [invalidZip, setInvalidZip] = useState(false);
    const [buttonShake, setButtonShake] = useState(false);

    function onChangeZip(event) {
        setZip(event.target.value);
    }

    function onChangeStore(val) {
        setStore(val);
    }

    function onSubmit() {
        // stops button click spam
        if (buttonShake) // && loading
            return;
        // if the zip is all digits and 5 digits long
        if (/^\d+$/.test(zip) && zip.length === 5) {
            setInvalidZip(false);
            console.log('search!!');
        }
        else {
            setInvalidZip(true);
            setButtonShake(true);
            setTimeout(() => {
                setButtonShake(false);
            }, 700)
        }
    }

    return (
        <div className='inputBox'>
            <div className='inputBoxHeader'>
                Find offers from your favorite local businesses.
            </div>
            <div className='inputBoxFields'>
                <div className='inputBoxFieldsRow'>
                    Find
                    <Select value={store} style={{ width: '200px' }} size='large' onChange={onChangeStore}>
                        <Option value="restaurants">Restaurants</Option>
                        <Option value="bars">Bars</Option>
                        <Option value="dentists">Dentists</Option>
                    </Select>
                </div>
                <div className='inputBoxFieldsRow'>
                    Near
                    <Input className={invalidZip ? 'invalidZip' : ''} value={zip} onChange={onChangeZip}
                        placeholder='Zip code' style={{ width: '200px' }} size='large' />
                </div>
                <div className='inputBoxFieldsRow'>
                    <Button size='large'>
                        <SlidersFilled style={{ color: '#1890ff' }} />
                    </Button>
                    <Button className={['inputBoxSubmit', buttonShake ? 'buttonShake' : ''].join(' ')} style={{ width: '200px' }} type='primary' size='large' onClick={onSubmit}>
                        Search
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InputBox;

