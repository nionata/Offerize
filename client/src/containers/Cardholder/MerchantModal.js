import React, { useState } from 'react';
import { Modal, Tabs, List, Avatar, Rate } from 'antd';
import {
    GlobalOutlined, EnvironmentOutlined,
    PhoneOutlined, ReadOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const MerchantModal = (props) => {

    const [tabKey, setTabKey] = useState('1');
    const [infoTabHeight, setInfoTabHeight] = useState(null);

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
                <TabPane tab="Tab 1" key="1" >
                    <div className='merchantModalBody' id={'merchantModalBody' + props.idx}>
                        <div className='merchantModalBodyLeft'>
                            <div className='merchantModalIconText'>
                                <EnvironmentOutlined />&nbsp;&nbsp;&nbsp;
                                {props.item.address}, {props.item.city}, {props.item.state}, {props.item.zipcode.slice(0, 5)}
                            </div>
                            <div className='merchantModalIconText'>
                                <GlobalOutlined />&nbsp;&nbsp;&nbsp;
                                    {props.item.website ?
                                    <a className='merchantModalWebsite' href={props.item.website}>
                                        Visit Website
                                    </a>
                                    : 'Website Unavailable'
                                }
                            </div>
                            <div className='merchantModalIconText'>
                                <PhoneOutlined />&nbsp;&nbsp;&nbsp;(717) 343-3423
                            </div>
                            <div className='merchantModalIconText' onClick={() => {
                                setInfoTabHeight(document.getElementById('merchantModalBody' + props.idx).offsetHeight);
                                return setTabKey('2');
                            }}
                            >
                                <ReadOutlined />&nbsp;&nbsp;&nbsp;
                                <span className='merchantModalReviewsLink'>
                                    Reviews
                                </span>
                            </div>
                        </div>
                        <div className='merchantModalBodyRight'
                            style={{ textAlign: props.item.timings ? '' : 'center' }}>
                            {props.item.timings ?
                                <ul className='merchantModalHours'>
                                    {props.item.timings.map((elem, idx) => {
                                        return (
                                            <>
                                                <li key={idx}>
                                                    {(new Date().getDay() - 1) % 7 === idx ?
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