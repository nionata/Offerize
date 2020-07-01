'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')
const axios = require('axios')
const { discountCalculator } = require('../../../public/discountCalculator')
const regression = require('regression')

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
        // need two calls, one with just merchant offers, and another
        // with all offers for all merchants
        // use the jws to get the specific merchant, for now just use 1

        // merchant id of the user
        const { merchant } = ctx.state.user

        let merchantOffers = await strapi.services.offers.find({ merchant });
        let allOffers = await strapi.services.offers.find(ctx.query);
        let data = await this.merchantData(merchantOffers, query);
        console.log(data);
        // this.merchantData(merchantOffers);
       
        return data;
       
    
    },

    async merchantData(offers, query){
        // pull all the previous offers and their redemption data
        // count the number of redemptions and look at questionaire with 
        // desired profits and redemption with claimed and see if they reached it
        // For each sale say to what degree they reached the goal ( a perent)
        // Next look at the sales per day and see what days the highest profit was generates
        // this is done by looking at time stamps for that one day per offer and using questionaire
        // to calculate the specific number of profit
        // we want to plot the percent profit VS sales for their duration
        // we also plot the percent profit of each sale for each specific day

        // {idealDiscountForDay:
        var allOffersData = {}; 
        let i;
        let dataProjections;
        let offersData = [];
        let highestProfitForDay = 0;
        for (i = 0; i < offers.length; i++){
            let indOffer = {}
            indOffer['id'] = offers[i]['id'];
            indOffer['discountRate'] = offers[i]['discountRate']

            let questionaire = offers[i]['questionaire'];
            let redemption = offers[i]['redemption'];
            let currentRedemptions = redemption['currentRedemptions']
            let redemptionTimeStamps = redemption['redemptionTimeStamps'];
            let minCustomers = questionaire['minCustomers'];
            let maxCustomers = questionaire['minCustomers'];
            let currentProfitMargin = questionaire['currentProfitMargin'];
            let idealProfit = questionaire['idealProfit'];
            let newDiscount = questionaire['newDiscount'];
            let transactionAmount = questionaire['avgTransactionAmount'];

            if(redemptionTimeStamps){
                // need to pass in updated value here as well for currentprofit margin
                dataProjections = discountCalculator(minCustomers, maxCustomers, currentProfitMargin, idealProfit, newDiscount, transactionAmount);
                let dailyStats = await this.dailyStats(redemptionTimeStamps, dataProjections[0])
                indOffer['dailyStats'] = dailyStats
                let currentDay = query['currentDay']
                currentDay = currentDay.replace(/"/g, '');


                if (dailyStats.get(currentDay) / idealProfit > highestProfitForDay){
                    highestProfitForDay = dailyStats.get(currentDay)/ idealProfit;
                }
            }

            let percentProfit = currentRedemptions * dataProjections[0] / idealProfit;
            indOffer['percentProfitReached'] = percentProfit
            offersData.push(indOffer);
                       
        }
        

        allOffersData['highestProfitForDay'] = highestProfitForDay
        allOffersData['offersData'] = offersData
        let lineBestFit = await this.bestFitCalculator(allOffersData['offersData'])
        allOffersData['lineBestFit'] = lineBestFit
        
        return allOffersData;
    },

    async dailyStats(timeStamps, profitMargin){
        let i;
        let dailyProfits = new Map();
        for (const [key, value] of Object.entries(timeStamps)) {
            // getting the date of transaction
            let date = value.split(" ", 1);
            // converting the data to a specific day of the week
            let dayOfWeek = await this.dayDeterminer(date);
            if(dailyProfits.has(dayOfWeek)){
                dailyProfits.set(dayOfWeek, dailyProfits.get(dayOfWeek) + profitMargin)
            }
            else{
                dailyProfits.set(dayOfWeek, 0);
            }
        }
        return dailyProfits;
    },

    // returns the day of the week provided a date
    async dayDeterminer(date){
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date(date);
        var dayName = days[d.getDay()];
        return dayName;
    },

    async bestFitCalculator(offersData){
        let fullDataSet = []
        let i;
        for(i = 0; i < offersData.length; i++){
            let offer = offersData[i]
            let discountRate = offer['discountRate']
            let percentProfitReached = offer['percentProfitReached']
            fullDataSet.push([discountRate, percentProfitReached])
        }
    
    let result = regression.polynomial(fullDataSet, { order: 3 });
    return result
    }



};
