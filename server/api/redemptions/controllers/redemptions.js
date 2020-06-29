'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

 // Everytime put is called, you want to increment the currentRedemptions and add a time stamp
module.exports = {

    async update(ctx){
        const { id } = ctx.params;
        let redemption = await strapi.services.redemptions.findOne({id});
        let numCurrentRedemptions = redemption['currentRedemptions'];
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + ' ' + time;
        let allTimeStamps = redemption['redemptionTimeStamps'];
        let size = redemption['redemptionTimeStamps'].length - 1;
        let lastKey = parseInt(Object.keys(allTimeStamps)[Object.keys(allTimeStamps).length-1]);
        allTimeStamps[lastKey + 1] =  dateTime;
        
        let data = 
        {
            currentRedemptions: numCurrentRedemptions + 1,
            redemptionTimeStamps: allTimeStamps

        }
        redemption = await strapi.services.redemptions.update({ id }, data
          );
          return sanitizeEntity(redemption, { model: strapi.models.redemptions });
    }
};
