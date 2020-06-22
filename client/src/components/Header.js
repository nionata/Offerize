import React from 'react';
import { Link } from 'react-router-dom';

import visaLogo from '../VisaIcons/visaLogo.svg';

function Header(props) {
    return (
        <div className='header'>
            <div className='headerFiller' />
            <div className='headerBody'>
                <img className='visaLogo' src={visaLogo} alt='Visa logo' draggable='false'
                    onClick={() => { }} />
                <Link to='/signin'>
                    Sign in
                </Link>
            </div>
            <div className='headerFiller' />
        </div>
    )
}

export default Header;

