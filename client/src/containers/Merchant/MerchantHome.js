import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';


import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';

function MerchantHome(props) {

    const { state, dispatch } = React.useContext(AuthContext);
    const history = useHistory();
    const [id, setId] = useState(null);

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
                setId(res.data.id);
                axios.get('http://api.offerize.xyz/merchants/' + res.data.id, axiosConfig)
                    .then(otherRes => {
                        console.log(otherRes);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })


    }, [])

    return (
        <>
            <Header />
            <h3 style={{ textAlign: 'center' }}>
                Merchant stuff
            </h3>
            <div style={{ height: '1000px' }} />
            <Footer />
        </>
    )
}

export default MerchantHome;