const axios = require('axios')
const GOOGLE_KEY = process.env.GOOGLE_KEY

const getCoord = (type, results) => {
    return results[0] && results[0].geometry ? results[0].geometry.location[type] : null
}

const getDetail = (type, result) => {
    return result && result[type] ? result[type] : null
}

module.exports = {

    async getLatLong(zipcode) {

        const resp = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_KEY}&components=postal_code:${zipcode}`)
        const { results } = resp.data
        
        return {
            lat: getCoord('lat', results),
            lon: getCoord('lng', results)
        }
    },

    async getSuppliers(lat, long, mcc) {

        const resp = await axios.post(`https://www.visa.com/supplierlocator-app/rest/search/supplier/desktop?lat=${lat}&lon=${long}&distLat=${lat}&distLon=${long}&text=&is=&mcc=${mcc}`)
        const { data } = resp.data

        return data && data.length > 0 ? data[0].list : null
    },

    async getPlaceId(address, name) {
        
        const resp = await axios.post(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${address} ${name}&inputtype=textquery&fields=place_id&key=${GOOGLE_KEY}`)
        const { candidates } = resp.data

        return candidates && candidates.length > 0 ? candidates[0].place_id : null
    },
    
    async getPlaceDetails(id) {

        const resp = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=reviews,opening_hours,icon,rating,price_level&key=${GOOGLE_KEY}`)
        const { result } = resp.data

        const opening_hours = getDetail('opening_hours', result)

        return { 
            timings: opening_hours ? opening_hours.weekday_text : null, 
            reviews: getDetail('reviews', result),
            icon: getDetail('icon', result),
            rating: getDetail('rating', result),
            price_level: getDetail('price_level', result)
        }
    },

    cleanMerchant(rawMerchant) {

        let merchant = {}
        const attrs = strapi.models.merchant.attributes

        Object.keys(rawMerchant).forEach(field => {
            if (attrs[field]) merchant[field] = rawMerchant[field]
        })

        return merchant
    }
}