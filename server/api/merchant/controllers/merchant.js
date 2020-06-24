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

const { sanitizeEntity } = require('strapi-utils')
const { getLatLong, getSuppliers, getPlaceId, getPlaceDetails, cleanMerchant } = require('./utils')

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

			const { industry, zipcode, show } = ctx.query
			const mccCode = industry

			if (!industry || !zipcode) {
				return ctx.badRequest(
					null,
					formatError({
					  id: 'Merchant.query.parameters.invalid',
					  message: 'Industry and zipcode parameters required!',
					})
				)
			}

			// in all cases except when we just want to 
			// show visa, add our merchants
			if (show !== 'visa') {
				const codes = mccCode.split(',')

				const queries = await Promise.all(codes.map(async (code) => {
					return strapi.services.merchant.find({ mccCode: code, zipcode })
				}))

				queries.forEach(potentialMerchants => merchants = merchants.concat(potentialMerchants))
			}

			// only when show all and visa,
			// add all merchants from the suppliers api
			if (show === 'all' || show === 'visa') {

				const { lat, lon } = await getLatLong(zipcode)

				let suppliers = await getSuppliers(lat, lon, mccCode)
				suppliers.forEach(supplier => {
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

				const { address, name } = merchant

				try { 
					const placeId = await getPlaceId(address, name)
					const { timings, reviews } = await getPlaceDetails(placeId)

					return {
						...merchant,
						timings,
						reviews
					}
				} catch (err) {
					console.log('PlaceDetailsError', err)

					return merchant
				}
			}))
		}
	},
}
