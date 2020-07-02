import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../App';

import { Steps, Button, message, Form, Input, InputNumber, Slider } from 'antd';
import { TagOutlined } from '@ant-design/icons';

import { Scatter, defaults } from 'react-chartjs-2';

import Header from '../../components/Header.js';
import Footer from '../../components/Footer.js';

defaults.global.legend.display = false;


const { Step } = Steps;

const steps = [
    {
        title: 'Questionnaire',
        content:
            <div>
                hi
            </div>,
    },
    {
        title: 'Insights',
        content: 'Second-content',
    },
    {
        title: 'Preview and deploy',
        content: 'Last-content',
    },
];

const UserSettings = (props) => {

    const { state, dispatch } = React.useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [merchantData, setMerchantData] = useState(null);
    const history = useHistory();
    const [current, setCurrent] = useState(1);

    const [minCust, setMinCust] = useState(null);
    const [maxCust, setMaxCust] = useState(null);
    const [profitMarg, setProfitMarg] = useState(null);
    const [profitIncr, setProfitIncr] = useState(null);
    const [averageMoney, setAverageMoney] = useState(null);
    const [discountRate, setDiscountRate] = useState(5);
    // true once the form is all filled out
    const [seeCustomers, setSeeCustomers] = useState(false);
    const [graphOneData, setGraphOneData] = useState(null);
    const [graphTwoData, setGraphTwoData] = useState(null);


    let minCustomersRef = React.createRef();
    let maxCustomersRef = React.createRef();
    let profitMarginRef = React.createRef();
    let profitIncreaseRef = React.createRef();
    let avgMoneyRef = React.createRef();

    useEffect(() => {
        // check if they are signed in
        if (localStorage.getItem('jwt') === null)
            history.push('/signin');

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt'))
            }
        };
        axios.get('/users/me', axiosConfig)
            .then(res => {
                console.log(res);
                setUserData(res.data);
                //get the merchant id and get that merchant info
                if (res.data.merchant == null)
                    history.push('merchantQs');
                else {
                    axios.get('/merchants/' + res.data.merchant, axiosConfig)
                        .then(otherRes => {
                            console.log(otherRes);
                            setMerchantData(otherRes.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    useEffect(() => {
        if (minCust != null && maxCust != null && profitMarg != null && profitIncr != null && averageMoney != null)
            setSeeCustomers(true);
        else
            setSeeCustomers(false);
    }, [minCust, maxCust, profitMarg, profitIncr, averageMoney]);

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        setCurrent(prev => prev + 1);

        const axiosConfig = {
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('jwt'))
            }
        };
        axios.get('/offers/trends?currentDay=%22Monday', axiosConfig)
            .then(res => {
                console.log(res);
                setGraphOneData(res.data[0].offersData);
                setGraphTwoData(res.data[1].offersData);
            })
            .error(err => {
                console.log(err);
            })
    }

    return (
        <>
            <Header />
            <div className='dashboard'>
                <div className='dashboardBody'>
                    <h3>
                        <TagOutlined style={{ paddingRight: '10px' }} />
                        Create offer {merchantData ? 'for ' + merchantData.name : ''}
                    </h3>
                    <div style={{ height: '20px' }} />
                    <div>
                        <Steps current={current} size='small' >
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">
                            <div style={{ height: '32px' }} />
                            {current === 0 ?
                                <div>
                                    <Form
                                        onFinish={onFinish}
                                        initialValues={{
                                            minCustomers: minCust,
                                            maxCustomers: maxCust,
                                            profitMargin: profitMarg,
                                            profitIncrease: profitIncr,
                                            avgMoney: averageMoney
                                        }}
                                    >
                                        <a className='signinTextAbove' onClick={() => minCustomersRef.current.focus()}>Minimum customers on a slow day</a>
                                        <div style={{ height: '8px' }} />
                                        <Form.Item
                                            name="minCustomers"
                                            rules={[
                                                { required: true, message: 'Input a number' },
                                            ]}
                                        >
                                            <InputNumber className='signinField' ref={minCustomersRef} min={0}
                                                value={minCust} onChange={(val) => setMinCust(val)} />
                                        </Form.Item>
                                        <div style={{ height: '20px' }} />

                                        <a className='signinTextAbove' onClick={() => maxCustomersRef.current.focus()}>Maxiumum customers on a busy day</a>
                                        <div style={{ height: '8px' }} />
                                        <Form.Item
                                            name="maxCustomers"
                                            rules={[{ required: true, message: 'Input a number' }]}
                                        >
                                            <InputNumber className='signinField' ref={maxCustomersRef} min={0}
                                                value={maxCust} onChange={(val) => setMaxCust(val)} />
                                        </Form.Item>
                                        <div style={{ height: '20px' }} />

                                        <a className='signinTextAbove' onClick={() => profitMarginRef.current.focus()}>Current profit margin</a>
                                        <div style={{ height: '8px' }} />
                                        <Form.Item
                                            name="profitMargin"
                                            rules={[
                                                { required: true, message: 'Input a discount rate' },
                                            ]}
                                        >
                                            <InputNumber className='signinField' ref={profitMarginRef}
                                                min={0} max={100}
                                                formatter={value => `${value}%`}
                                                parser={value => value.replace('%', '')}
                                                value={profitMarg} onChange={(val) => setProfitMarg(val)} />
                                        </Form.Item>
                                        <div style={{ height: '20px' }} />

                                        <a className='signinTextAbove' onClick={() => profitIncreaseRef.current.focus()}>Expected profit increase</a>
                                        <div style={{ height: '8px' }} />
                                        <Form.Item
                                            name="profitIncrease"
                                            rules={[
                                                { required: true, message: 'Input a discount rate' },
                                            ]}
                                        >
                                            <InputNumber className='signinField' ref={profitIncreaseRef}
                                                min={0} max={100}
                                                formatter={value => `${value}%`}
                                                parser={value => value.replace('%', '')}
                                                value={profitIncr} onChange={(val) => setProfitIncr(val)} />
                                        </Form.Item>
                                        <div style={{ height: '20px' }} />


                                        <a className='signinTextAbove' onClick={() => avgMoneyRef.current.focus()}>Average money spent per transaction</a>
                                        <div style={{ height: '8px' }} />
                                        <Form.Item
                                            name="avgMoney"
                                            rules={[
                                                { required: true, message: 'Input a number' },
                                            ]}
                                        >
                                            <InputNumber className='signinField' ref={avgMoneyRef}
                                                min={0}
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                value={averageMoney} onChange={(val) => setAverageMoney(val)} />
                                        </Form.Item>
                                        <div style={{ height: '20px' }} />

                                        <a className='signinTextAbove' onClick={() => avgMoneyRef.current.focus()}>Discount rate</a>
                                        <InputNumber
                                            value={discountRate} min={0} max={100}
                                            onChange={(val) => setDiscountRate(val)}
                                            formatter={value => `${value}%`}
                                            parser={value => value.replace('%', '')}
                                            style={{ marginLeft: '105px' }} />
                                        <div style={{ height: '8px' }} />
                                        <Slider defaultValue={30} value={discountRate}
                                            min={0} max={profitMarg ? profitMarg - 1 : 100}
                                            onChange={(val) => setDiscountRate(val)}
                                            tipFormatter={val => `${val}%`}
                                            style={{ width: '280px' }} />
                                        <div style={{ height: '20px' }} />

                                        <div style={{
                                            fontWeight: 600, width: '225px', transition: '0.15s opacity',
                                            opacity: seeCustomers ? '1' : 0
                                        }}>
                                            Number of customers needed to:
                                            <div style={{ height: '16px' }} />
                                            <div style={{ paddingLeft: '25px' }}>
                                                <span style={{ float: 'left' }}>
                                                    Break even
                                                </span>
                                                <span style={{ float: 'right', borderBottom: '1px solid #707070' }}>
                                                    {Math.round(window.discountCalculator(
                                                        minCust, maxCust, profitMarg, profitIncr, discountRate, averageMoney
                                                    )[1])}
                                                </span>
                                            </div>
                                            <br />
                                            <div style={{ height: '16px' }} />
                                            <div style={{ paddingLeft: '25px' }}>
                                                <span style={{ float: 'left' }}>
                                                    Hit profit margin
                                                </span>
                                                <span style={{ float: 'right', borderBottom: '1px solid #707070' }}>
                                                    {Math.round(window.discountCalculator(
                                                        minCust, maxCust, profitMarg, profitIncr, discountRate, averageMoney
                                                    )[2])}
                                                </span>
                                            </div>
                                        </div>
                                        <br />
                                        <div style={{ height: '20px' }} />

                                        <Button type="primary" htmlType='submit' style={{ fontWeight: 600 }}>
                                            Continue
                                        </Button>
                                    </Form>
                                </div>
                                : (current === 1 ?
                                    <div>
                                        <div style={{ height: '12px' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                            <div style={{ width: '315px', textAlign: 'center', marginRight: '20px' }}>
                                                <div style={{ fontWeight: 600, paddingBottom: '10px' }}>
                                                    Data from your previous offers
                                                </div>
                                                <Scatter
                                                    width={100}
                                                    height={100}
                                                    data={{
                                                        datasets: [{
                                                            label: 'Scatter Dataset',
                                                            pointBackgroundColor: '#202020',
                                                            data: !graphOneData ? [] :
                                                                graphOneData.map(elem => {
                                                                    return ({
                                                                        x: parseInt(elem.discountRate),
                                                                        y: parseInt(elem.percentProfitReached),
                                                                        Sunday: elem.dailyStats['Sunday'],
                                                                        Monday: elem.dailyStats['Monday'],
                                                                        Tuesday: elem.dailyStats['Tuesday'],
                                                                        Wednesday: elem.dailyStats['Wednesday'],
                                                                        Thursday: elem.dailyStats['Thursday'],
                                                                        Friday: elem.dailyStats['Friday'],
                                                                        Saturday: elem.dailyStats['Saturday'],
                                                                    })
                                                                })
                                                        }]
                                                    }}
                                                    options={{
                                                        scales: {
                                                            xAxes: [{
                                                                scaleLabel: {
                                                                    display: true,
                                                                    labelString: "Discount (%)",
                                                                },
                                                                ticks: {
                                                                    beginAtZero: true
                                                                }
                                                            }],
                                                            yAxes: [{
                                                                scaleLabel: {
                                                                    display: true,
                                                                    labelString: "Profit recorded (%)",
                                                                },
                                                                ticks: {
                                                                    beginAtZero: true
                                                                }
                                                            }]
                                                        },
                                                        tooltips: {
                                                            callbacks: {
                                                                label: (tooltipItem, data) => {
                                                                    return ['Sunday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Sunday,
                                                                    'Monday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Monday,
                                                                    'Tuesday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Tuesday,
                                                                    'Wednesday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Wednesday,
                                                                    'Thursday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Thursday,
                                                                    'Friday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Friday,
                                                                    'Saturday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Saturday];
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <div style={{ width: '315px', textAlign: 'center' }}>
                                                <div style={{ fontWeight: 600, paddingBottom: '10px' }}>
                                                    Data from merchants around you
                                                </div>
                                                <Scatter
                                                    width={100}
                                                    height={100}
                                                    data={{
                                                        datasets: [{
                                                            label: 'Scatter Dataset',
                                                            pointBackgroundColor: '#202020',
                                                            data: !graphTwoData ? [] :
                                                                graphTwoData.map(elem => {
                                                                    return ({
                                                                        x: parseInt(elem.discountRate),
                                                                        y: parseInt(elem.percentProfitReached),
                                                                        Sunday: elem.dailyStats['Sunday'],
                                                                        Monday: elem.dailyStats['Monday'],
                                                                        Tuesday: elem.dailyStats['Tuesday'],
                                                                        Wednesday: elem.dailyStats['Wednesday'],
                                                                        Thursday: elem.dailyStats['Thursday'],
                                                                        Friday: elem.dailyStats['Friday'],
                                                                        Saturday: elem.dailyStats['Saturday'],
                                                                    })
                                                                })
                                                        }]
                                                    }}
                                                    options={{
                                                        scales: {
                                                            xAxes: [{
                                                                scaleLabel: {
                                                                    display: true,
                                                                    labelString: "Discount (%)",
                                                                },
                                                                ticks: {
                                                                    beginAtZero: true
                                                                }
                                                            }],
                                                            yAxes: [{
                                                                scaleLabel: {
                                                                    display: true,
                                                                    labelString: "Profit recorded (%)",
                                                                },
                                                                ticks: {
                                                                    beginAtZero: true
                                                                }
                                                            }]
                                                        },
                                                        tooltips: {
                                                            callbacks: {
                                                                label: (tooltipItem, data) => {
                                                                    return ['Sunday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Sunday,
                                                                    'Monday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Monday,
                                                                    'Tuesday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Tuesday,
                                                                    'Wednesday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Wednesday,
                                                                    'Thursday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Thursday,
                                                                    'Friday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Friday,
                                                                    'Saturday: $' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].Saturday];
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>

                                        </div>

                                        <div style={{ height: '20px' }} />

                                        <Button type="primary" onClick={() => setCurrent(prev => prev - 1)}
                                            style={{ marginRight: '12px', fontWeight: 600 }} >
                                            Previous
                                        </Button>
                                        <Button type="primary" onClick={() => console.log(minCust)}
                                            style={{ fontWeight: 600 }} >
                                            Next
                                        </Button>
                                    </div>
                                    : '')}
                        </div>
                        {/* <div className="steps-action">
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => setCurrent(prev => prev + 1)}>
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                    Done
                                </Button>
                            )}
                            {current > 0 && (
                                <Button style={{ margin: '0 8px' }} onClick={() => setCurrent(prev => prev - 1)}>
                                    Previous
                                </Button>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>
            <div style={{ height: '400px' }} />
            <Footer />
        </>
    )
}

export default UserSettings;