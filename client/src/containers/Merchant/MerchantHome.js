import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';

import { List, Card, Button } from 'antd';
import { ShopOutlined, ThunderboltFilled, TagFilled, PlusOutlined } from '@ant-design/icons';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';
import OfferCard from './OfferCard';
import CreateOffer from './CreateOffer';

const data = [
    {
        title: '20% off storewide',
    },
    {
        title: '10% off basketballs',
    },
    {
        title: '5% cashback through Thursday',
    },
    {
        title: '15% off sitewide',
    },
];

function MerchantHome(props) {

    const { state, dispatch } = React.useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [merchantData, setMerchantData] = useState(null);
    const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        // check if they are signed in
        if (localStorage.getItem('jwt') === null)
            history.push('/signin');

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt'))
            }
        };
        axios.get('/users/me', axiosConfig)
            .then(res => {
                console.log(res);
                setUserData(res.data);
                //get the merchant id and get that merchant info
                if (res.data.merchant == null)
                    history.push('merchantQs');
                else {
                    axios.get('/merchants/' + res.data.merchant, axiosConfig)
                        .then(otherRes => {
                            console.log(otherRes);
                            setMerchantData(otherRes.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    return (
        <>
            <Header />
            <div className='dashboard'>
                <div className='dashboardBody'>
                    <h3>
                        Welcome back{userData == null ? '' : ', ' + userData.username}
                    </h3>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>
                        Settings:&nbsp;&nbsp;
                        <Link to='/merchantSettings'>
                            <a className='dashboardGreyLinks'>
                                - Visit
                            </a>
                        </Link>
                    </div>
                    <div style={{ height: '100px' }} />
                    <div style={{ textAlign: 'center' }}>
                        <h3>
                            <ShopOutlined />&nbsp;&nbsp;
                            {merchantData == null ? '' : merchantData.name}
                        </h3>
                    </div>
                    <div style={{ height: '16px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>
                        <span>
                            Active offers:
                        </span>
                        <span style={{ float: 'right' }}>
                            <Link to='/merchantCreateOffer'>
                                <Button type='primary' style={{ fontWeight: 600 }} onClick={() => setShowCreateOfferModal(true)}>
                                    <PlusOutlined />
                                    Create offer
                                </Button>
                            </Link>
                        </span>
                        <div style={{ height: '16px' }} />
                        <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 2,
                                xl: 2,
                                xxl: 2,
                            }}
                            dataSource={data}
                            renderItem={item => (
                                <OfferCard item={item} active={true} />
                            )}
                        />

                        <div style={{ height: '24px' }} />

                        Inactive offers:
                        <div style={{ height: '16px' }} />
                        <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 2,
                                lg: 2,
                                xl: 2,
                                xxl: 2,
                            }}
                            dataSource={data}
                            renderItem={item => (
                                <OfferCard item={item} active={false} />
                            )}
                        />
                    </div>
                </div>
            </div>
            <div style={{ height: '600px' }} />
            <Footer />
        </>
    )
}

export default MerchantHome;