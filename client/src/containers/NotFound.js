import React from 'react';
import { useHistory } from "react-router-dom";

import { Result, Button } from 'antd';

function NotFound() {

    let history = useHistory();

    function goHome() {
        history.push('/');
    }

    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={goHome}>
                    Back Home
                </Button>
            }
        />
    )
}

export default NotFound;