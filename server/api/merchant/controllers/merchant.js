'use strict'

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

const { parseMultipartData, sanitizeEntity } = require('strapi-utils')
const { cleanMerchant, distance } = require('../utils/base')
const { getSuppliers } = require('../utils/supplier')
const { getLatLong, getPlaceId, getPlaceDetails } = require('../utils/google')

const formatError = error => [
    { messages: [{ id: error.id, message: error.message, field: error.field }] },
]

module.exports = {

	async find(ctx) {
		let merchants = []

		if (ctx.query._q) {

			merchants = await strapi.services.merchant.search(ctx.query)

			return merchants.map(merchant => sanitizeEntity(merchant, {
				model: strapi.models.merchant
			}))
		} else {

			const { industry, lat, lon, show } = ctx.query
			const mccCode = industry

			if (!industry || !lat || !lon) {
				return ctx.badRequest(
					null,
					formatError({
					  id: 'Merchant.query.parameters.invalid',
					  message: 'Industry, lat, and lon parameters required!',
					})
				)
			}

			// in all cases except when we just want to 
			// show visa, add our merchants
			if (show !== 'visa') {
				const codes = mccCode.split(',')

				// run a db query for each mccCode sent
				const queries = await Promise.all(codes.map(async (code) => {
					return strapi.services.merchant.find({ mccCode: code })
				}))

				// temp array
				let results = []

				// reduce all the queries into the list of results
				queries.forEach(potentialMerchants => results = results.concat(potentialMerchants))

				// calculate the distance between the merchant and the cardholder
				// and filter out any results further than 5 miles away
				merchants = results.filter(merchant => {
					const { lat: lat2, lon: lon2 } = merchant
					const merchantDistance = distance(lat, lon, lat2, lon2)
					return merchantDistance < 5
				})
			}

			// only when show all and visa,
			// add all merchants from the suppliers api
			if (show === 'all' || show === 'visa') {

                let suppliers = await getSuppliers(lat, lon, mccCode)
				if (suppliers) suppliers.forEach(supplier => {
                    
					const { clientId, address1, zipCode } = supplier

					supplier.merchant_id = clientId
					supplier.address = address1
					supplier.zipcode = zipCode
					merchants.push(supplier)
				})
			}

			// sanitize merchants and add google details
			return await Promise.all(merchants.map(async (rawMerchant) => {

				const merchant = cleanMerchant(rawMerchant)

				const { address, name, lat: lat2, lon: lon2 } = merchant

				try { 
					const placeId = await getPlaceId(address, name)
					const details = await getPlaceDetails(placeId)
					
					return {
						...merchant,
						...details,
						distance: distance(lat, lon, lat2, lon2)
					}
				} catch (err) {
					console.log('PlaceDetailsError', err)

					return merchant
				}
			}))
		}
	},

	async create(ctx) {
		
		let merchant 

		if (ctx.is('multipart')) {

			return badRequest('No multipart')
		} else {

			// using the address and zipcode,
			// get the lat and lon of the merchant
			const { address, zipcode } = ctx.request.body
			if (address && zipcode) {
				const { lat, lon } = await getLatLong(address, zipcode)

				ctx.request.body.lat = `${lat}`
				ctx.request.body.lon = `${lon}`
			}

			// create the merchant entry
			merchant = await strapi.services.merchant.create(ctx.request.body)
			
			// add the merchant to the current user
			const { id } = ctx.state.user 
			await strapi.query('user', 'users-permissions').update({ id }, { merchant: merchant.id })
		}

		return sanitizeEntity(merchant, { model: strapi.models.merchant })
	},
}
