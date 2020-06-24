import React from 'react';
import { Input, Select, Button } from 'antd';
import { SlidersFilled } from '@ant-design/icons';

const { Option } = Select;

function InputBox(props) {
    return (
        <div className='inputBox'>
            <div className='inputBoxHeader'>
                Find offers from your favorite local businesses.
            </div>
            <div className='inputBoxFields'>
                <div className='inputBoxFieldsRow'>
                    Find
                    <Select defaultValue="Restaurants" style={{ width: '200px' }} size='large' onChange={props.selectChange}>
                        <Option value="Restaurants">Restaurants</Option>
                        <Option value="Bars">Bars</Option>
                        <Option value="Dentists">Dentists</Option>
                    </Select>
                </div>
                <div className='inputBoxFieldsRow'>
                    Near
                    <Input placeholder='Zip code' style={{ width: '200px' }} size='large' />
                </div>
                <div className='inputBoxFieldsRow'>
                    <Button size='large'>
                        <SlidersFilled style={{ color: '#1890ff' }} />
                    </Button>
                    <Button style={{ width: '200px' }} type='primary' size='large'>
                        Search
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InputBox;

