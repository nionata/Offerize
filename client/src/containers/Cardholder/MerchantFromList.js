import React, { useState } from 'react';
import { List, Avatar, Rate, Popover } from 'antd';

import MerchantModal from './MerchantModal';
import parseDate from './parseDate';

import pizza from './../../Pizza.svg'

const MerchantFromList = (props) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <MerchantModal showModal={showModal} setShowModal={setShowModal} item={props.item} idx={Math.random() * 1000000} />

            {/* <Popover placement='right' title='hi' content='yo what is up my guy'> */}
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={pizza} />}
                    onClick={() => {
                        setShowModal(true);
                    }}
                    title={<a href={props.item.website}>{props.item.name}</a>}
                    description={<>
                        <Rate disabled allowHalf defaultValue={Math.round(props.item.rating * 2) / 2} style={{ fontSize: '14px' }} />
                        <div style={{ height: '4px' }} />
                        {props.item.rating ?
                            '$'.repeat(props.item.rating) + ' • ' + props.item.address
                            : '$$ • ' + props.item.address}
                        <div style={{ height: '4px' }} />
                        {/* sunday starts on a 0 but monday should be a 0 */}
                        {parseDate(props.item.timings)}
                    </>}
                />
            </List.Item>
            {/* </Popover> */}
        </>
    )
}

export default MerchantFromList;