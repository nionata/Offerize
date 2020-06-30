import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../App';
import { Spin, Popover, Dropdown, Menu } from 'antd';

import {
    UserOutlined
} from '@ant-design/icons';

import visaLogo from '../VisaIcons/visaLogo.svg';

function Header(props) {

    const { state, dispatch } = React.useContext(AuthContext);
    const [loadSignout, setLoadSignout] = useState(false);

    const history = useHistory();

    useEffect(() => {
    }, [])

    const signout = () => {
        setLoadSignout(true);
        dispatch({
            type: "LOGOUT"
        });
        // Since signing out is instant, make a fake loading symbol for a second to feel more authentic
        setTimeout(() => {
            setLoadSignout(false);
        }, 750);
    }

    const onMenuClick = (event) => {
        if (event.key === '1') {
            history.push('/merchant');
        } else if (event.key === '2') {
            history.push('/merchant');
        } else {
            signout();
            history.push('/');
        }
    }

    return (
        <div className='header'>
            <div className='headerFiller' />
            <div className='headerBody'>
                {/* center it and make the  clickable region smaller */}
                <div className='clickableLogo' style={{ height: '80px', marginBottom: '28px', overflow: 'hidden' }}>
                    <img className='visaLogo' src={visaLogo} alt='Visa logo' draggable='false'
                        onClick={() => history.push('/')} />
                </div>
                {loadSignout ?
                    <Spin style={{ padding: '6px 40px 0 0' }}></Spin>
                    :
                    (state.isAuthenticated ?
                        <Dropdown placement="bottomRight"
                            overlay={
                                <Menu onClick={onMenuClick}>
                                    <Menu.ItemGroup title="Account">
                                        <Menu.Item key="1">Dashboard</Menu.Item>
                                        <Menu.Item key="2">Preferences</Menu.Item>
                                        <Menu.Item key="3">Sign out →</Menu.Item>
                                    </Menu.ItemGroup>
                                </Menu>
                            }>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <UserOutlined style={{ fontSize: '18px' }} />
                            </a>
                        </Dropdown>

                        :
                        <Link to='/signin'>
                            Sign in
                        </Link>
                    )
                }


            </div>
            <div className='headerFiller' />
        </div>
    )
}

export default Header;

