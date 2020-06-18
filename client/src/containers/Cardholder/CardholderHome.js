import React from 'react';
import { Input, Select, Button } from 'antd';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';

const { Option } = Select;

function CardholderHome(props) {

    function handleChange() {

    }

    return (
        <>
            <Header />
            <div className='inputBox'>
                <div className='inputBoxHeader'>
                    Find offers from your favorite local businesses.
                </div>
                <div className='inputBoxFields'>
                    <div className='inputBoxFieldsRow'>
                        Find
                        <Select defaultValue="Restaurants" style={{ width: '200px' }} size='large' onChange={handleChange}>
                            <Option value="Restaurants">Restaurants</Option>
                            <Option value="Bars">Bars</Option>
                            <Option value="Dentists">Dentists</Option>
                        </Select>
                    </div>
                    <div className='inputBoxFieldsRow'>
                        Near
                        <Input placeholder='Zip code' style={{ width: '200px' }} size='large' />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button className='inputSearchButton' type='primary'>
                        Search
                    </Button>
                </div>
            </div>
            <div style={{ height: '200px' }} />
            <Footer />
        </>
    )
}

export default CardholderHome;

