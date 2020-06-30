import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';

import { message } from 'antd';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';

const UserSettings = (props) => {

    const { state, dispatch } = React.useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [merchantData, setMerchantData] = useState(null);
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
        axios.get('http://api.offerize.xyz/users/me', axiosConfig)
            .then(res => {
                console.log(res);
                setUserData(res.data);
                //get the merchant id and get that merchant info
                if (res.data.merchant == null)
                    history.push('merchantQs');
                else {
                    axios.get('http://api.offerize.xyz/merchants/' + res.data.merchant, axiosConfig)
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
            })


    }, []);

    return (
        <>
            <Header />
            <div className='dashboard'>
                <div className='dashboardBody'>
                    <h3>
                        Settings
                    </h3>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>
                        Username:&nbsp; {userData == null ? '' : userData.username}&nbsp;&nbsp;
                        <a className='dashboardGreyLinks' onClick={() => message.info('This feature is not currently supported.  Stay tuned!', 5)}>
                            - Change
                        </a>
                        <div style={{ height: '6px' }} />
                        Email:&nbsp; {userData == null ? '' : userData.email}&nbsp;&nbsp;
                        <a className='dashboardGreyLinks' onClick={() => message.info('This feature is not currently supported.  Stay tuned!', 5)}>
                            - Change
                        </a>
                        <div style={{ height: '30px' }} />
                        Merchant information&nbsp;&nbsp;
                        <Link to='/merchantQs'>
                            <a className='dashboardGreyLinks'>
                                - Change
                            </a>
                        </Link>
                    </div>

                </div>
            </div>
            <div style={{ height: '1000px' }} />
            <Footer />
        </>
    )
}

export default UserSettings;