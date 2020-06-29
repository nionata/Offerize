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


function discountCalculator(minCust, maxCust, profitMargin, profitIncrease, newDiscount, totalTransaction) {

    var percentProfMarg = profitMargin * 1.0 / 100;
    var costToMake = totalTransaction - totalTransaction * percentProfMarg;
    var profitPerCurrentTransaction = totalTransaction * percentProfMarg;
    var currentProfit = profitPerCurrentTransaction * (1.0 * (minCust + maxCust) / 2);
    var extraProfit = profitIncrease - currentProfit;

    var newDiscountPercent = 1.0 - (1.0 * newDiscount / 100);
    totalTransaction = totalTransaction * newDiscountPercent;
    var newProfitMargin = totalTransaction - costToMake;
    var customersToBreakEven = currentProfit / newProfitMargin;
    
    var numOfCustomersNeeded = 1.0 * profitIncrease / newProfitMargin;
    var extraCustomers = numOfCustomersNeeded - (1.0 * (minCust + maxCust) / 2);
    return [numOfCustomersNeeded, customersToBreakEven];    
}
console.log('Discount Calculator Loaded');


