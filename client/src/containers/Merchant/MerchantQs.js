import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './../../App';
import { Input, Checkbox, Form, Button, message, Alert, Select } from 'antd';

import visaLogo from './../../VisaIcons/visaLogoBlue.svg';
import states50 from './States50';

const { Option } = Select;

const MerchantQs = (props) => {

    const { dispatch } = React.useContext(AuthContext);

    const [signinShake, setSigninShake] = useState(false);
    const [invalidCreds, setInvalidCreds] = useState(false);
    const [loading, setLoading] = useState(false);
    const [merchantData, setMerchantData] = useState(null);
    const [form] = Form.useForm();

    let nameRef = React.createRef();
    let addressRef = React.createRef();
    let cityRef = React.createRef();
    let stateRef = React.createRef();
    let zipcodeRef = React.createRef();
    let mccCodeRef = React.createRef();
    let industryRef = React.createRef();
    let merchantIdRef = React.createRef();

    // const [nameVal, setNameVal] = useState('');
    // const [addressVal, setAddressVal] = useState('');
    // const [cityVal, setCityVal] = useState('');
    // const [stateVal, setStateVal] = useState('');
    // const [zipcodeVal, setZipcodeVal] = useState('');
    // const [mccCodeVal, setMccCodeVal] = useState('');
    // const [industryVal, setIndustryVal] = useState('');
    // const [merchantVal, setMerchantVal] = useState('');

    const history = useHistory();

    useEffect(() => {
        nameRef.current.focus();
        // check if they are signed in
        if (localStorage.getItem('jwt') === null)
            history.push('/signin');

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt'))
            }
        };
        axios.get('http://api.offerize.xyz/users/me', axiosConfig)
            .then(res => {
                console.log(res);
                //get the merchant id and get that merchant info
                if (res.data.merchant != null) {
                    axios.get('http://api.offerize.xyz/merchants/' + res.data.merchant, axiosConfig)
                        .then(otherRes => {
                            console.log(otherRes);
                            setMerchantData(otherRes.data);
                            // so all the values will be prefilled
                            form.resetFields();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            })

    }, []);

    const onFinish = values => {
        console.log('Received values of form: ', values);
        setLoading(true);
        console.log(JSON.parse(localStorage.getItem('jwt')));

        const postData = {
            name: values.name,
            address: values.address,
            city: values.city,
            state: values.state,
            zipcode: values.zipcode,
            mccCode: values.mccCode,
            industry: values.industry,
            merchant_id: values.merchantId
        }

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt'))
            }
        };

        axios.post('http://api.offerize.xyz/merchants', postData, axiosConfig)
            .then(res => {
                console.log(res.data);
                setLoading(true);
                history.push('/merchant');
            })
            .catch(error => {
                setLoading(false);
                setSigninShake(true);
                setInvalidCreds(true);
                setTimeout(() => {
                    setSigninShake(false);
                }, 600)
            });
    }

    return (

        <div className='signinPage'>
            <div style={{ height: '60px' }} />

            <Alert className='signinAlert' style={{ opacity: invalidCreds ? 1 : 0 }}
                message={'Request failed. Make sure you are logged in.'}
                type="error" showIcon />

            <div className={['signinBox', signinShake ? 'signinShake' : ''].join(' ')}>
                <Form
                    form={form}
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        name: merchantData ? merchantData.name : '',
                        address: merchantData ? merchantData.address : '',
                        city: merchantData ? merchantData.city : '',
                        state: merchantData ? merchantData.state : '',
                        zipcode: merchantData ? merchantData.zipcode : '',
                        mccCode: merchantData ? merchantData.mccCode : '',
                        industry: merchantData ? merchantData.industry : '',
                        merchantId: merchantData ? merchantData.merchant_id : ''
                    }}
                    onFinish={onFinish}
                >
                    <div style={{ textAlign: 'center' }}>
                        <Link to='/'>
                            <img src={visaLogo} alt="visa logo" style={{ width: 100, height: 'auto', margin: '-30px 0 0 0' }} draggable='false' />
                        </Link>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <b className='signinTextAbove' onClick={() => nameRef.current.focus()}>
                            Enter business information
                        </b>
                    </div>

                    <a className='signinTextAbove' onClick={() => nameRef.current.focus()}>Business name</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, message: 'Input a name' },
                        ]}
                    >
                        <Input className='signinField' ref={nameRef} />
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => addressRef.current.focus()}>Street address</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="address"
                        rules={[
                            { required: true, message: 'Input an address' },
                        ]}
                    >
                        <Input className='signinField' ref={addressRef} />
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => cityRef.current.focus()}>City</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="city"
                        rules={[{ required: true, message: 'Input a city' }]}
                    >
                        <Input className='signinField' ref={cityRef} />
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => stateRef.current.focus()}>State</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="state"
                        rules={[
                            { required: true, message: 'Input a state' },
                        ]}
                    >
                        <Select className='signinField' ref={stateRef}>
                            {states50.map(elem => {
                                return <Option value={elem}>{elem.replace('_', ' ')}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => zipcodeRef.current.focus()}>Zip code</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="zipcode"
                        rules={[
                            { required: true, message: 'Input a zip code' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (/^\d+$/.test(value) && value.length === 5) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Zip code must be 5 digits');
                                },
                            }),
                        ]}
                    >
                        <Input className='signinField' ref={zipcodeRef} />
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => mccCodeRef.current.focus()}>MCC code</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="mccCode"
                        rules={[
                            { required: true, message: 'Input a MCC code' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (/^\d+$/.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('MCC code must only contain digits');
                                },
                            })
                        ]}
                    >
                        <Input className='signinField' ref={mccCodeRef} />
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => industryRef.current.focus()}>Industry</a>
                    <Form.Item
                        name="industry"
                        rules={[{ required: true, message: 'Input a password' }]}
                    >
                        <Select className='signinField' ref={industryRef}>
                            <Option value='RESTAURANTS/BARS'>Restaurants + Bars</Option>
                            <Option value='AUTO RENTAL'>Auto Rental</Option>
                            <Option value='BARBER/BEAUTY SHOPS'>Barbers + Beauty</Option>
                            <Option value='HOTELS & MOTELS'>Hotels</Option>
                            <Option value='LAUNDRY/CLEANING/GARMENT & SHOE REPAIR'>Laundry + Garment</Option>
                            <Option value='GROCERY STORES/SUPERMARKETS/BAKERIES'>Groceries + Bakeries</Option>
                            <Option value='HARDWARE/PAINT/GLASS'>Hardware</Option>
                        </Select>
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => merchantIdRef.current.focus()}>Merchant ID</a>
                    <Form.Item
                        name="merchantId"
                        rules={[
                            { required: true, message: 'Input a merchant ID' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (/^\d+$/.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Merchant ID must only contain digits');
                                },
                            })
                        ]}
                    >
                        <Input className='signinField' ref={merchantIdRef} />
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <Button type='primary' className='signinButton' htmlType="submit" loading={loading} style={{ margin: '24px 0 0 0' }}>
                        Continue to dashboard
                    </Button>

                </Form>
            </div>
            <div style={{ height: '140px' }} />
        </div>
    )
}
export default MerchantQs;



// {
//     "name": "YAMA TAIYO JAPANESE REST",
//     "city": "PALM HARBOR",
//     "state": "Florida",
//     "mccCode": "5812",
//     "industry": "RESTAURANTS/BARS",
//     "merchant_id": 33434213,
//     "address": "660 ALDERMAN RD",
//     "zipcode": 34683
// }