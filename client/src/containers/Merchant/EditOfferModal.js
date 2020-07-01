import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Switch, InputNumber, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const EditOfferModal = (props) => {

    const [loading, setLoading] = useState(false);

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
    }

    function onOk(value) {
        console.log('onOk: ', value);
    }

    const onFinish = (values) => {
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
                    remember: true,
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
                    rules={[{ required: true, message: 'Input a discount rate' }]}
                >
                    <InputNumber className='signinField' ref={discountRateRef} />
                </Form.Item>
                <div style={{ height: '32px' }} />

                <a className='signinTextAbove' onClick={() => discountRateRef.current.focus()}>Active</a>
                <Form.Item
                    name="active"
                >
                    <Switch defaultChecked={true} ref={discountRateRef} />
                </Form.Item>
                <div style={{ height: '32px' }} />

                <a className='signinTextAbove' onClick={() => discountRateRef.current.focus()}>Expiration date</a>
                <div style={{ height: '8px' }} />
                <Form.Item
                    name="expirationDate"
                    rules={[{ required: true, message: 'Select a date and time' }]}
                >
                    {/*  */}
                    <RangePicker
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