import React from 'react';
import { List, Avatar } from 'antd';

import pizza from './../../Pizza.svg'

const MerchantList = (props) => {
    return (
        <div style={{ padding: '0 25px 10px 25px' }}>
            <List
                dataSource={props.merchants}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={pizza} />}
                            title={<a href="https://sbarro.com">{item.id}</a>}
                            description={item.desc}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default MerchantList;