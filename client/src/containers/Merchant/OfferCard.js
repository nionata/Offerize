import React, { useState } from 'react';
import { List, Card } from 'antd';

import { ThunderboltFilled, FireFilled, CrownFilled, TagFilled } from '@ant-design/icons';

import EditOfferModal from './EditOfferModal';

const OfferCard = (props) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <EditOfferModal showModal={showModal} setShowModal={setShowModal} />
            <List.Item>
                <Card
                    className='offerCard'
                    hoverable
                    // title={<>
                    //     <TagFilled style={{ color: '#f7b600' }} />&nbsp;&nbsp;
                    // {props.item.title}
                    // </>}
                    onClick={() => setShowModal(true)}
                    style={{ fontSize: '16px' }}
                >
                    <TagFilled className={props.active ? 'offerCardTag' : 'offerCardTagInactive'} />
                    {props.item.title}
                    <br />
                    <span style={{ paddingLeft: '26px', color: 'rgba(0,0,0,0.5' }}>
                        Expires on July 4th
                    </span>
                </Card>
            </List.Item>
        </>
    )
}

export default OfferCard;