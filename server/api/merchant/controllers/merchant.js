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
    
    async find(ctx) {
        console.log(ctx.request.url);
        // retrieves the data
        let entities;
        if (ctx.query._q) {
          entities = await strapi.services.merchant.search(ctx.query);
        } else {
          entities = await strapi.services.merchant.find(ctx.query);
        }
        // filters the valid data for the picked zipcode
        var validMerchants =  entities.filter(function(merchant) {
            return merchant.zipcode == 78705;
        });
        
        var i;
        for (i = 0; i < validMerchants.length; i++) {
            var merchant = validMerchants[i];
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
            // first need to retrieve placeId in order to make search for timings and reviews
            await axios.post("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+ address + " " +  name + "&inputtype=textquery&fields=place_id&key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U")
                .then((response) => {
                placeId = response.data.candidates[0].place_id;
              })
            
              // getting the timings and reviews location
            await axios.get("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + "&fields=reviews,opening_hours&key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U")
                .then((response) => {
                timings = response.data.result.opening_hours.weekday_text
                reviews = response.data.result.reviews
            })
                }
            }
        
           // Retrieve data from supplier api 
            // need to extract lat and long from zipcode
            await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U&components=postal_code:${zipCode}`)
                .then((response) => {
                lat = response.data.results[0].geometry.location.lat;
                long = response.data.results[0].geometry.location.lng;
            
              })
              var listMerchants;
              // use lat and long to access the providers DB so that we can add some basic data to the DB data and return it 
              await axios.post(`https://www.visa.com/supplierlocator-app/rest/search/supplier/desktop?lat=${lat}&lon=${long}&distLat=${lat}&distLon=${long}&text=&is=&mcc=5812`)
              .then((response) => {
                  listMerchants = response.data.data[0].list;
                })
                  var i;
                  for (i = 0; i < listMerchants.length; i++) {
                      var placeId;
                      var timings;
                      var reviews;

                    // deleting unnecessary fields
                      merchant = listMerchants[i];
                      merchant.id = merchant.clientId;
                      delete merchant.clientId;
                      delete merchant.address2;
                      delete merchant.mccCode;
                      delete merchant.enhancedDataLevel;
                      delete merchant.businessEnterpriseIndicator;
                      delete merchant.websiteUrl;
                      delete merchant.distance;
                      delete merchant.streetViewUrl;
                      delete merchant.lat;
                      delete merchant.lon;
                      
                  await axios.post("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input="+ merchant.address1 + " " +  merchant.name + "&inputtype=textquery&fields=place_id&key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U")
                      .then((response) => {
                      if(response.data.candidates[0] != null){
                        placeId = response.data.candidates[0].place_id;
                      }
                    })
                  
                    if(placeId) {
                    // getting the timings and reviews location
                  await axios.get("https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeId + "&fields=reviews,opening_hours&key=AIzaSyCPHQ-nIVO74LuBOl4231hsoCB6oSeh64U")
                      .then((response) => {
                        // need to do error checking for if timings and review exist 
                      timings = response.data.result.opening_hours.weekday_text
                      reviews = response.data.result.reviews
                  })

                  merchant.timings = timings;
                  merchant.reviews = reviews;
                }
                  listMerchants[i] = merchant;
                }
            
            return validMerchants.map(entity => sanitizeEntity(entity, { model: strapi.models.merchant }));
      },
    };
    

   
 
  
