import React from 'react';
import visaLogo from '../VisaIcons/visaLogo.svg';

function Header(props) {
    return (
        <div className='header'>
            <div className='headerFiller' />
            <div className='headerBody'>
                <img className='visaLogo' src={visaLogo} alt='Visa logo' draggable='false'
                    onClick={() => { }} />
                <a href='#'>
                    Sign in
                </a>
            </div>
            <div className='headerFiller' />
        </div>
    )
}

export default Header;

