/*
    We use the profit margin, max/min customers, and profit increase goal to calculate the #
    of increased customers needed to boost profits to wanted amount 

    1. First use profit margin and # of customers to calculate the amount of current profit
    2. Calculate the amount of extra profit needed to reach ideal profit
    3. Take that to generate values of sales and extra customers pairs that would attain the wanted nubmer, in 
    a format that the user can toggle with a bar
    4. Then we boot up the trends endpoint, providing statistical history on previous days of the weeks and 
    how sales were on those days, with an average number of people that shopped that day
*/

// change profit increase to percent increase

function discountCalculator(minCust, maxCust, profitMargin, profitIncreasePercent, newDiscount, totalTransaction) {

    var percentProfMarg = profitMargin * 1.0 / 100;
    var costToMake = totalTransaction - totalTransaction * percentProfMarg;
    var profitPerCurrentTransaction = totalTransaction * percentProfMarg;
    var currentTotalProfit = profitPerCurrentTransaction * (1.0 * (minCust + maxCust) / 2);
    var profitIncrease = currentTotalProfit * (profitIncreasePercent / 100) + currentTotalProfit;
    var newDiscountPercent = 1.0 - (1.0 * newDiscount / 100);
    totalTransaction = totalTransaction * newDiscountPercent;
    var newProfitMargin = totalTransaction - costToMake;
    var customersToBreakEven = currentTotalProfit / newProfitMargin;
    var numOfCustomersNeeded = 1.0 * profitIncrease / newProfitMargin;
    var extraCustomers = numOfCustomersNeeded - (1.0 * (minCust + maxCust) / 2);
    return [newProfitMargin, numOfCustomersNeeded, customersToBreakEven];    
}
module.exports.discountCalculator = discountCalculator;
console.log(discountCalculator(50,50,30,50,10,10));


