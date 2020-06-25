import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Input, Checkbox, Form, Button, message } from 'antd';

import visaLogo from '../VisaIcons/visaLogoBlue.svg';

const Signin = (props) => {

    const { dispatch } = React.useContext(AuthContext);
    const initialState = {
        email: "",
        password: "",
        isSubmitting: false,
        errorMessage: null
    };
    const [data, setData] = React.useState(initialState);
    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    const [invalidCreds, setInvalidCreds] = useState(false);

    let userRef = React.createRef();
    let passRef = React.createRef();

    const history = useHistory();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const onFinish = values => {
        console.log('Received values of form: ', values);
        localStorage.clear();

        axios.post('http://api.offerize.xyz/auth/local', {
            identifier: values.username,
            password: values.password
        })
            .then(res => {
                console.log(res.data);
                if (res.ok) {
                    return res.json();
                }
                throw res;
            })
            .then(resJson => {
                dispatch({
                    type: "LOGIN",
                    payload: resJson
                })
            })
            .catch(error => {
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: error.message || error.statusText
                });
            });
    }

    return (

        <div className='signinPage'>
            <div style={{ height: '120px' }} />

            <div className='signinBox'>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                // onFinishFailed={this.onFinishFailed}
                >
                    {/* padding centers it a little better */}
                    <div style={{ textAlign: 'center', padding: '0 6px 0 0' }}>
                        <Link to='/'>
                            <img src={visaLogo} alt="visa logo" style={{ width: 100, height: 'auto', margin: '-30px 0 0 0' }} draggable='false' />
                        </Link>
                    </div>

                    <a className='signinTextAbove' onClick={() => userRef.current.focus()}>Username</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Input an username' }]}
                    >
                        <Input className='signinField' size='large' ref={userRef} />
                    </Form.Item>
                    <div style={{ height: '32px' }} />

                    <a className='signinTextAbove' onClick={() => passRef.current.focus()}>Password</a>
                    <a className='signinForgot' onClick={() => message.info('This feature is not currently supported.  Stay tuned!', 5)}>
                        Forgot your password?
                    </a>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Input a password' }]}
                    >
                        <Input.Password type="password" className='signinField' size='large' ref={passRef} />
                    </Form.Item>
                    <div style={{ height: '32px' }} />

                    <Checkbox className='signinCheckbox' defaultChecked={true} onChange={() => console.log('check')}>
                        Stay signed in
                    </Checkbox>

                    <Button type='primary' className='signinButton' htmlType="submit" loading={props.loading} >
                        Sign in
                    </Button>
                    <div className='space32' />

                    <div style={{ textAlign: 'center', fontWeight: '600' }}>
                        <span>Don't have an account?&nbsp;&nbsp;</span>
                        <Link to='/signup'>
                            <a className='signinBottomText'>
                                Sign up
                            </a>
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Signin;