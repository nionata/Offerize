'use strict';
const { discountCalculator } = require('../../../public/discountCalculator')
const regression = require('regression')
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports.merchantData = async (offers, query, dataset) => 
  {
        var allOffersData = {}; 
        allOffersData['dataset'] = dataset;
        let i;
        let dataProjections;
        let offersData = [];
        let highestProfitForDay = 0;
        let idealDiscountForDay = 0;
        for (i = 0; i < offers.length; i++){
            // indOffer holds important details specific to each offer
            let indOffer = {}
            indOffer['id'] = offers[i]['id'];
            indOffer['discountRate'] = offers[i]['discountRate']

            // need these fields to make calculations
            let questionaire = offers[i]['questionaire'];
            let redemption = offers[i]['redemption'];
            let currentRedemptions = redemption['currentRedemptions']
            let redemptionTimeStamps = redemption['redemptionTimeStamps'];
            let minCustomers = questionaire['minCustomers'];
            let maxCustomers = questionaire['maxCustomers'];
            let currentProfitMargin = questionaire['currentProfitMargin'];
            let idealProfit = questionaire['idealProfit'];
            let newDiscount = questionaire['newDiscount'];
            let transactionAmount = questionaire['avgTransactionAmount'];
            
            if(redemptionTimeStamps){
                // need to pass in updated value here as well for currentprofit margin
                dataProjections = discountCalculator(minCustomers, maxCustomers, currentProfitMargin, idealProfit, newDiscount, transactionAmount);
                let dailyStats = await this.dailyStats(redemptionTimeStamps, dataProjections[0])
                // these are individual sales per each day for each discount 
                indOffer['dailyStats'] = dailyStats
                let currentDay = query['currentDay']
                // formating string received from query
                currentDay = currentDay.replace(/"/g, '');

                // everytime the day specified finds a higher profit percentage for a specific discount, this is updated
                if (dailyStats[currentDay] / dataProjections[1] > highestProfitForDay){
                    // highestProfitForDay is the highest percent profit a specific day with a specific sale reach
                    highestProfitForDay = dailyStats[currentDay]/ dataProjections[1];
                    idealDiscountForDay = newDiscount
                }
            }
            let percentProfit = currentRedemptions * dataProjections[0] / dataProjections[1];
            // percentProfit is the percent of the profit the whole offer reached
            indOffer['percentProfitReached'] = percentProfit
            offersData.push(indOffer);           
        }
        // these details for specific day pertain to effectiveness of offer on selected DoW
        allOffersData['detailsForSpecificDay'] = {'idealDiscountForDay' : idealDiscountForDay, 'percentOfProfitMade' : highestProfitForDay}
        // offers data holds all the offer specific info
        allOffersData['offersData'] = offersData
        let lineBestFit = await this.bestFitCalculator(allOffersData['offersData'])
        allOffersData['lineBestFit'] = lineBestFit
        return allOffersData;
    }

    module.exports.dailyStats = async (timeStamps, profitMargin) => {
        let i;
        let dailyProfits = {}
        for (const [key, value] of Object.entries(timeStamps)) {
            // getting the date of transaction
            let date = value.split(" ", 1);
            // converting the data to a specific day of the week
            let dayOfWeek = await this.dayDeterminer(date);
            if(dayOfWeek in dailyProfits){

                dailyProfits[dayOfWeek] = dailyProfits[dayOfWeek] + profitMargin
            }
            else{
                dailyProfits[dayOfWeek] = profitMargin
            }
        }
        return this.cleanUpEntries(dailyProfits);
    }

    module.exports.cleanUpEntries = async (profits) => {
        for (const [key, value] of Object.entries(profits)) {
            // rounding values to two decimal places
            let newValue = Math.round(value * 100) / 100
            profits[key] = newValue
    }
        return profits;
},

    // returns the day of the week provided a date
    module.exports.dayDeterminer = async (date) => {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var d = new Date(date);
        var dayName = days[d.getDay()];
        return dayName;
    },

    module.exports.bestFitCalculator = async (offersData) => {
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

