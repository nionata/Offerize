'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')
const axios = require('axios')
const {merchantData} = require('../services/offers')

/**
 *  We need to know how many people use cash, visa, other money transaction network
 *  The number of offers redeemed, accounts to a typical transaction.. We then track this in the timeline it was based off and
 *  see how effective the coupon was as in did it generate the goal target, and how many dollars short it was 
 * 
 *  For each coupon you need to display 
 *  1. User gets basic data on many more customers needed to break even/ make desired profit
 *  2. Then they have the option to "View more data", in which we display supporting data to help them make decisions.
    3. Data includes, previous success of merchant’s offers, previous success of similar merchant’s offers (same mcc), and previous success of all merchant’s offers in same area
    4.This is displayed in a set of three graphs with a line of best fit drawn, displaying two things: the specific day and what sales are best then, and also best all time sales
    5.All this data is called through the endpoint offers/trends.
    6.Create three functions that each retrieves different levels of merchant’s offer success data

 */


module.exports = {
    async trends(ctx) {
        let query = ctx.request.query
        const { merchant } = ctx.state.user
        let merchantOffers = await strapi.services.offers.find({ merchant });
        let allOffers = await strapi.services.offers.find();
        merchantOffers = await merchantData(merchantOffers, query);
        allOffers =  await merchantData(allOffers, query);
        let combinedOffers = [merchantOffers, allOffers]
        return combinedOffers;
    },
};
