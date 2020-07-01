'use strict';
const { discountCalculator } = require('../../../public/discountCalculator')
const regression = require('regression')
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports.merchantData = async (offers, query) => 
  {
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


                if (dailyStats[currentDay] / idealProfit > highestProfitForDay){
                    highestProfitForDay = dailyStats[currentDay]/ idealProfit;
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
                dailyProfits[dayOfWeek] = 0
            }
        }
        return this.cleanUpEntries(dailyProfits);
    }


    module.exports.cleanUpEntries = async (profits) => {
        for (const [key, value] of Object.entries(profits)) {
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

