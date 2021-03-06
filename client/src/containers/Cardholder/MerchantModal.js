import React, { useState } from 'react';
import { Modal, Tabs, List, Avatar, Rate, Button, message } from 'antd';
import {
    GlobalOutlined, EnvironmentOutlined,
    PhoneOutlined, ReadOutlined, TagFilled
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;

function mod(n, m) {
    return ((n % m) + m) % m;
}

const key = 'updatable';

const MerchantModal = (props) => {

    const [tabKey, setTabKey] = useState('1');
    const [infoTabHeight, setInfoTabHeight] = useState(null);

    const openMessage = () => {
        message.loading({ content: 'Loading...', key });
        setTimeout(() => {
            message.success({ content: 'Offer successfully redeemed!', key, duration: 4 });
        }, 1000);
        // axios.post('/redemptions/' + )
    };

    return (
        <Modal
            className='merchantModal'
            visible={props.showModal}
            onCancel={() => {
                return props.setShowModal(false);
            }}
            title={
                <div style={{ textAlign: 'center' }}>
                    {props.item.name}
                </div>
            }
            footer={null}
            width='600px'
        >
            <Tabs activeKey={tabKey} animated={{ inkBar: true, tabPane: true }} style={{ height: tabKey === '1' ? infoTabHeight : 'auto' }}>
                <TabPane tab="Tab 1" key="1">
                    <div id={'merchantModalBody' + props.idx}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Rate disabled allowHalf defaultValue={Math.round(props.item.rating * 2) / 2} style={{ fontSize: '16px' }} />
                            <div style={{ height: '8px' }} />
                            {props.item.rating ?
                                '$'.repeat(props.item.rating) + ' • ' + Math.round(10 * props.item.distance) / 10 + ' miles away'
                                : Math.round(10 * props.item.distance) / 10 + ' miles away'}
                        </div>
                        <div style={{ height: '16px' }} />
                        <div className='merchantModalBody' >
                            <div className='merchantModalBodyLeft'>
                                <div className='merchantModalIconText'>
                                    <EnvironmentOutlined />&nbsp;&nbsp;&nbsp;
                                {props.item.address}, {props.item.city}, {props.item.state}, {String(props.item.zipcode).slice(0, 5)}
                                </div>
                                <div className='merchantModalIconText'>
                                    <GlobalOutlined />&nbsp;&nbsp;&nbsp;
                                    {props.item.website ?
                                        <a className='merchantModalWebsite' href={props.item.website}>
                                            Visit Website
                                    </a>
                                        : 'Website unavailable'
                                    }
                                </div>
                                <div className='merchantModalIconText'>
                                    <PhoneOutlined />&nbsp;&nbsp;&nbsp;
                                    {props.item.formatted_phone_number ? props.item.formatted_phone_number : 'Phone number unavailable'}
                                </div>
                                <div className='merchantModalIconText' onClick={() => {
                                    setInfoTabHeight(document.getElementById('merchantModalBody' + props.idx).offsetHeight);
                                    return setTabKey('2');
                                }}>
                                    <ReadOutlined />&nbsp;&nbsp;&nbsp;
                                    <span className='merchantModalReviewsLink'>
                                        Reviews
                                    </span>
                                </div>
                                {props.activeOffers && props.activeOffers.map(elem => {
                                    return (<>
                                        <div className='merchantModalIconText'>
                                            <TagFilled style={{ color: '#f7b600' }} />&nbsp;&nbsp;&nbsp;
                                            {elem.description}&nbsp;&nbsp;&nbsp;
                                            <Button type="primary" size={'small'}
                                                onClick={openMessage}>
                                                Redeem
                                            </Button>
                                        </div>

                                    </>)
                                })}


                            </div>
                            <div className='merchantModalBodyRight'
                                style={{ textAlign: props.item.timings ? '' : 'center' }}>
                                {props.item.timings ?
                                    <ul className='merchantModalHours'>
                                        {props.item.timings.map((elem, idx) => {
                                            return (
                                                <>
                                                    <li key={idx}>
                                                        {mod((new Date().getDay() - 1), 7) === idx ?
                                                            <>
                                                                <b style={{ float: 'left' }}>{elem.split('day: ')[0].slice(0, 3)}</b>
                                                                <b style={{ float: 'right' }}>{elem.split('day: ')[1]}</b>
                                                            </>
                                                            :
                                                            <>
                                                                <span style={{ float: 'left' }}>{elem.split('day: ')[0].slice(0, 3)}</span>
                                                                <span style={{ float: 'right' }}>{elem.split('day: ')[1]}</span>
                                                            </>
                                                        }
                                                    </li>
                                                    <br />
                                                </>
                                            )
                                        })}
                                    </ul>
                                    : 'Hours unavailable'
                                }
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane className='merchantModalReviews' tab="Tab 2" key="2">
                    <a className='reviewsBack' onClick={() => setTabKey('1')}>
                        ← Back
                    </a>
                    <div style={{ height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {props.item.reviews ?
                            <Rate disabled allowHalf defaultValue={Math.round(props.item.rating * 2) / 2} style={{ fontSize: '16px' }} />
                            : ''}
                        <br />
                        <div style={{ color: '#595959', fontSize: '16px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;{props.item.reviews ? props.item.reviews.length + ' reviews' : 'No reviews'}
                        </div>
                    </div>
                    {props.item.reviews ?
                        <List
                            dataSource={props.item.reviews}
                            // size='large'
                            renderItem={elem => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={elem.profile_photo_url} />}
                                        title={
                                            <>
                                                {elem.author_name}
                                            &nbsp;&nbsp;&nbsp;
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Rate disabled allowHalf defaultValue={Math.round(elem.rating * 2) / 2} style={{ fontSize: '12px' }} />
                                                &nbsp;&nbsp;&nbsp;
                                                <span style={{ color: 'rgba(0,0,0,0.45)' }}>{elem.relative_time_description}</span>
                                                </div>
                                            </>
                                        }
                                        description={elem.text}
                                    />
                                </List.Item>
                            )}
                        />
                        : ''}
                </TabPane>
            </Tabs>
        </Modal >
    )
}

export default MerchantModal;