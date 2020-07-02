import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Switch, InputNumber, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const EditOfferModal = (props) => {

    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);
    const [stateDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    let descriptionRef = React.createRef();
    let discountRateRef = React.createRef();
    let activeRef = React.createRef();
    let expirationDateRef = React.createRef();

    // stop scrolling behind the modal so the time picker doesn't glitch up
    useEffect(() => {
        if (props.showModal)
            document.body.style.overflow = 'hidden';
        return () => document.body.style.overflow = 'unset';
    }, [props.showModal])

    function onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        let newStartDate = dateString[0].replace(' ', 'T') + ':00.000Z';
        let newEndDate = dateString[1].replace(' ', 'T') + ':00.000Z'
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }

    function onOk(value) {
        console.log('onOk: ', value);
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);

        const postData = {
            description: values.description,
            discountRate: values.discountRate,
            active: active,
            expirationDate: endDate
        }
        console.log(stateDate);
        console.log(endDate);

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt'))
            }
        };

        // if (fetchedMerchantId == null) {
        //     axios.post('/merchants', postData, axiosConfig)
        // }
    }


    return (
        <Modal
            visible={props.showModal}
            onCancel={() => {
                return props.setShowModal(false);
            }}
            title={
                <div style={{ textAlign: 'center' }}>
                    View and Edit Offer
                </div>
            }
            footer={null}
        >
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    active: true,
                }}
                onFinish={onFinish}
            >

                <a className='signinTextAbove' onClick={() => descriptionRef.current.focus()}>Description</a>
                <div style={{ height: '8px' }} />
                <Form.Item
                    name="description"
                    rules={[{ required: true, message: 'Input a description' }]}
                >
                    <Input className='signinField' ref={descriptionRef} />
                </Form.Item>
                <div style={{ height: '32px' }} />

                <a className='signinTextAbove' onClick={() => discountRateRef.current.focus()}>Discount rate</a>
                <div style={{ height: '8px' }} />
                <Form.Item
                    name="discountRate"
                    rules={[
                        { required: true, message: 'Input a discount rate' },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (value != null && parseInt(value) >= 0 && parseInt(value) <= 100) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Input a percentage between 0 and 100');
                            },
                        }),
                    ]}
                >
                    <InputNumber className='signinField' ref={discountRateRef}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')} />
                </Form.Item>
                <div style={{ height: '32px' }} />

                <a className='signinTextAbove' onClick={() => discountRateRef.current.focus()}>Active</a>
                <div style={{ height: '8px' }} />

                <Switch ref={activeRef} checked={active} onChange={(val) => setActive(val)} />
                <div style={{ height: '32px' }} />

                <a className='signinTextAbove' onClick={() => expirationDateRef.current.focus()}>Expiration date</a>
                <div style={{ height: '8px' }} />
                <Form.Item
                    name="expirationDate"
                    rules={[{ required: true, message: 'Select a date and time' }]}
                >
                    <RangePicker
                        ranges={{
                            'Today': [moment(), moment()],
                            'This Week': [moment().startOf('week'), moment().endOf('week')],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                        }}
                        showTime={{ format: "hh:mm a", minuteStep: 15, use12Hours: true }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={onChange}
                        onOk={onOk}
                    />
                </Form.Item>

                <Button type='primary' className='signinButton' htmlType="submit" loading={loading} style={{ margin: '32px 0 8px' }}>
                    Update offer
                </Button>
            </Form>
        </Modal>
    )
}

export default EditOfferModal;