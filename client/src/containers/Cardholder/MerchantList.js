import React from 'react';
import { List, Avatar, Rate } from 'antd';

import pizza from './../../Pizza.svg'

const MerchantList = (props) => {

    function parseDate(timings) {
        if (!timings)
            return 'Hours unavailable';
        else if (timings[0] === 'Monday: Open 24 hours')
            return 'Open 24 hours';
        // Thursday: 10:00 AM – 10:00 PM
        let currHours = timings[(new Date().getDay() - 1) % 7].split(' ');
        if (currHours[1] === 'Closed')
            return 'Closed Today';
        let opening = null;
        let closing = null;
        // Handles case where open and close times both in AM/PM (ex. "Thursday: 3:30 – 9:30 PM")
        if (currHours[2] === '–') {
            opening = currHours[1] + ' ' + currHours[4]; // probably PM
            closing = currHours[3] + ' ' + currHours[4];
        } else {
            opening = currHours[1] + ' ' + currHours[2];
            closing = currHours[4] + ' ' + currHours[5];
        }
        let opening24 =
            (opening.split(' ')[1] == 'PM'
                ? ((parseInt(opening.split(':')[0]) + 12) + ':' + opening.split(':')[1]).split(' ')[0]
                : opening.split(' ')[0])
        let closing24 =
            (closing.split(' ')[1] == 'PM'
                ? ((parseInt(closing.split(':')[0]) + 12) + ':' + closing.split(':')[1]).split(' ')[0]
                : closing.split(' ')[0])
        let date = new Date();
        // 10:00
        let currTime = date.getHours() + ':' +
            (String(date.getMinutes()).length === 1 ? '0' + String(date.getMinutes()) : String(date.getMinutes()));
        if (currTime < opening24 || currTime > closing24)
            return 'Opens at ' + opening;
        else
            return 'Closes at ' + closing;
    }

    return (
        <List
            dataSource={props.merchants}
            size='large'
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={pizza} />}
                        title={<a href="https://sbarro.com">{item.name}</a>}
                        description={<>
                            <Rate disabled allowHalf defaultValue={Math.round(item.rating * 2) / 2} style={{ fontSize: '14px' }} />
                            {/* {item.city}, {item.state} */}
                            <div style={{ height: '4px' }} />
                            {item.rating ?
                                '$'.repeat(item.rating) + ' • ' + item.address
                                : '$$ • ' + item.address}
                            <div style={{ height: '4px' }} />
                            {/* sunday starts on a 0 but monday should be a 0 */}
                            {parseDate(item.timings)}
                        </>}
                    />
                </List.Item>
            )}
        />
    )
}

export default MerchantList;