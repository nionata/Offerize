import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Input, Checkbox, Form, Button, message } from 'antd';

import visaLogo from '../VisaIcons/visaLogoBlue.svg';

const Signup = (props) => {

    const [invalidCreds, setInvalidCreds] = useState(false);

    let emailRef = React.createRef();
    let userRef = React.createRef();
    let passRef = React.createRef();
    let confirmRef = React.createRef();

    const history = useHistory();

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    const onFinish = values => {
        console.log('Received values of form: ', values);
        // do some authorization call...
    }

    return (

        <div className='signinPage'>
            <div style={{ height: '60px' }} />

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

                    <a className='signinTextAbove' onClick={() => emailRef.current.focus()}>Email</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Input an email' },
                            { type: 'email', message: 'Enter a valid email' }
                        ]}
                    >
                        <Input className='signinField' ref={emailRef} />
                    </Form.Item>
                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => userRef.current.focus()}>Username</a>
                    <div style={{ height: '8px' }} />
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Input a username' }]}
                    >
                        <Input className='signinField' ref={userRef} />
                    </Form.Item>

                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => passRef.current.focus()}>Password</a>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Input a password' }]}
                    >
                        <Input.Password type="password" className='signinField' ref={passRef} />
                    </Form.Item>

                    <div style={{ height: '20px' }} />

                    <a className='signinTextAbove' onClick={() => confirmRef.current.focus()}>Confirm Password</a>
                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords do not match');
                                },
                            }),
                        ]}
                    >
                        <Input.Password type="password" className='signinField' ref={confirmRef} />
                    </Form.Item>

                    <Button type='primary' className='signinButton' htmlType="submit" loading={props.loading} style={{ margin: '24px 0' }}>
                        Sign up
                    </Button>

                    <div style={{ textAlign: 'center', fontWeight: '600' }}>
                        <span>Have an account?&nbsp;&nbsp;</span>
                        <Link to='/signin'>
                            <a className='signinBottomText'>
                                Sign in
                            </a>
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Signup;