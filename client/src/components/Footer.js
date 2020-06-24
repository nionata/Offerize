import React from 'react';

import visaFooter from '../VisaIcons/visaFooter.png';
import facebook from '../SocialIcons/facebook.svg';
import instagram from '../SocialIcons/instagram.svg';
import linkedin from '../SocialIcons/linkedin.svg';
import twitter from '../SocialIcons/twitter.svg';

function Footer(props) {
    return (
        <div className='footer'>
            <div className='footerFiller' />
            <div className='footerBody'>
                <img className='visaFooter' src={visaFooter} alt='Visa, everywhere you want to be' draggable='false' />
                <div>
                    <a href='https://www.facebook.com/VisaUnitedStates'>
                        <img className='footerSocial' src={facebook} alt='Facebook' />
                    </a>
                    <a href='https://twitter.com/Visa'>
                        <img className='footerSocial' src={twitter} alt='Twitter' />
                    </a>
                    <a href='https://www.linkedin.com/company/visa'>
                        <img className='footerSocial' src={linkedin} alt='LinkedIn' />
                    </a>
                    <a href='https://www.instagram.com/visa_us/'>
                        <img className='footerSocial' src={instagram} alt='Instagram' />
                    </a>
                </div>
            </div>
            <div className='footerFiller' />
        </div>
    )
}

export default Footer;

