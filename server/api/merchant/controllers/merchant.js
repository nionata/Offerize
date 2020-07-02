'use strict'

const { sanitizeEntity } = require('strapi-utils')

const formatError = error => [
    { messages: [{ id: error.id, message: error.message, field: error.field }] },
]

module.exports = {

	/*

		Get merchants with details and offers 

		1. Conditionally pull merchant data in our system
		2. Conditinally pull the supplier data from visa and format 
		3. Add Google Details for all merchants

	*/
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
					const merchantDistance = strapi.services.merchant.distance(lat, lon, lat2, lon2)
					return merchantDistance < 5
				})
			}

			// only when show all and visa,
			// add all merchants from the suppliers api
			if (show === 'all' || show === 'visa') {

				// get all the trend offers
				let trendOffers = await strapi.services.offers.find({ merchant: NULL })
				console.log('trend', trendOffers)

                const suppliers = await strapi.services.supplier.getSuppliers(lat, lon, mccCode)
				if (suppliers) suppliers.forEach(supplier => {
                    
					const { clientId, address1, zipCode } = supplier

					// rename fields to match our db
					supplier.merchant_id = clientId
					supplier.address = address1
					supplier.zipcode = zipCode
					
					// add a trend offer to this merchant
					let offer = trendOffers.pop()
					supplier.offers = offer ? [offer] : []

					// let local offers override supplier
					if (merchants.findIndex(merchant => merchant.name === supplier.name) === -1) merchants.push(supplier)
				})
			}

			// sanitize merchants and add google details
			return await Promise.all(merchants.map(async (rawMerchant) => {

				const merchant = strapi.services.merchant.cleanMerchant(rawMerchant)

				const { address, name, lat: lat2, lon: lon2 } = merchant

				try { 
					const placeId = await strapi.services.google.getPlaceId(address, name)
					const details = await strapi.services.google.getPlaceDetails(placeId)
					
					return {
						...merchant,
						...details,
						distance: strapi.services.merchant.distance(lat, lon, lat2, lon2)
					}
				} catch (err) {
					console.log('PlaceDetailsError', err)

					return merchant
				}
			}))
		}
	},

	/*
	
		Create a merchant account for a user

		1. 
	
	*/
	async create(ctx) {
		
		let merchant 

		if (ctx.is('multipart')) {

			return badRequest('No multipart')
		} else {

			// using the address and zipcode,
			// get the lat and lon of the merchant
			const { address, zipcode } = ctx.request.body
			if (address && zipcode) {
				const { lat, lon } = await strapi.services.google.getLatLong(address, zipcode)

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
