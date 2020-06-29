import React from 'react';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';

function MerchantHome(props) {
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