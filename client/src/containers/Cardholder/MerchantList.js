import React, { useState } from 'react';
import { List } from 'antd';

import MerchantFromList from './MerchantFromList';

const MerchantList = (props) => {

    return (
        <>
            <List
                className='merchantList'
                dataSource={props.merchants}
                size='large'
                renderItem={item => {
                    return (
                        <MerchantFromList item={item} />
                    )
                }}
            />
        </>
    )
}

export default MerchantList;