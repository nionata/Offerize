import React, { useState } from 'react';
import { List, Card } from 'antd';

import { ThunderboltFilled, FireFilled, CrownFilled, TagFilled } from '@ant-design/icons';

import EditOfferModal from './EditOfferModal';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', ' November', 'December']

const OfferCard = (props) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <EditOfferModal showModal={showModal} setShowModal={setShowModal} />
            <List.Item>
                <Card
                    className='offerCard'
                    hoverable
                    onClick={() => setShowModal(true)}
                    style={{ fontSize: '16px' }}
                >
                    <TagFilled className={props.active ? 'offerCardTag' : 'offerCardTagInactive'} />
                    {props.item.description}
                    <br />
                    <span style={{ paddingLeft: '26px', color: 'rgba(0,0,0,0.5' }}>
                        {props.item.expirationDate ?
                            'Expires on ' + months[new Date(props.item.expirationDate).getMonth()] + ' ' + new Date(props.item.expirationDate).getDate()
                            : 'Expiration date unavailable'
                        }
                    </span>
                </Card>
            </List.Item>
        </>
    )
}

export default OfferCard;