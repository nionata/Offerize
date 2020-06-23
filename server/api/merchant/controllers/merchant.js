'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */


 /*
    1. Get database data and format with provider data, matching up criteria
    2. Combine this data with google data
    3. Get provider data and combine with google data
    4. Write conditions for "show" that can be used to query which results will be
    5. Return the right array of responses
    6. Make sure routing is all correct

    The flow is that the user enters a zip code and they can see the locations either in the DB
    or in the providers and they should be allowed to select if they want to see each on separately or both.
    That is simulated with the "show" query
 */
const { sanitizeEntity } = require('strapi-utils');
const axios = require('axios');

module.exports = {
    // First need to retrieve corresponding provider data
   
    
    async find(ctx) {

        // retrieves the data
        let entities;
        if (ctx.query._q) {
          entities = await strapi.services.merchant.search(ctx.query);
        } else {
          entities = await strapi.services.merchant.find(ctx.query);
        }
        var i;
        for (i = 0; i < entities.length; i++) {
            
            var merchant = entities[i];
            var zipCode = merchant.zipcode;
            var lat;
            var long;
            

            // need to figure out situation with timings, group strapi?
            if(!merchant.timings){
                // need to retrieve timings from google
                // first search for the place ID based on inputted information
                // use place ID to search for opening hours
                //input that to the DB and save it correspondily

                var address = merchant.address;
                var name = merchant.Name;
                var placeId;
                var timings;
                var reviews;

            await axios.post("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+ address + " " +  name + "&inputtype=textquery&fields=place_id&key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U")
                .then((response) => {
                placeId = response.data.candidates[0].place_id;
              })

            await axios.get("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + "&fields=reviews,opening_hours&key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U")
                .then((response) => {
                timings = response.data.result.opening_hours.weekday_text
                reviews = response.data.result.reviews
            })

            merchant.timings = timings;
            merchant.reviews = reviews
            entities[i] = merchant;
            console.log(merchant);


            }
            
            // Bind google data of hours (if not there) and reviews for each merchant in DB for provided zip code
            

            // // need to extract lat and long from zipcode
            // await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U&components=postal_code:${zipCode}`)
            //     .then((response) => {
            //     lat = response.data.results[0].geometry.location.lat;
            //     long = response.data.results[0].geometry.location.lng;
            
            //   })
              
            //   // use lat and long to access the providers DB so that we can add some basic data to the DB data and return it 

            //  await axios.post(`https://www.visa.com/supplierlocator-app/rest/search/supplier/desktop?lat=${lat}&lon=${long}&distLat=${lat}&distLon=${long}&text=&is=&mcc=5812`)
            //   .then((response) => {
            //       console.log(response.data);
            //   })

          }
        
    
            return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.merchant }));
      },
    };
    

   
 
  
