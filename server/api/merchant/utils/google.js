const axios = require('axios')
const GOOGLE_API_HOST = 'https://maps.googleapis.com/maps/api'
const GOOGLE_KEY = process.env.GOOGLE_KEY

const { getCoord, getDetail } = require('./base')

module.exports.getLatLong = async (zipcode) => {

    const resp = await axios.get(`${GOOGLE_API_HOST}/geocode/json?key=${GOOGLE_KEY}&components=postal_code:${zipcode}`)
    const { results } = resp.data
    
    return {
        lat: getCoord('lat', results),
        lon: getCoord('lng', results)
    }
}

module.exports.getPlaceId = async (address, name) => {
        
    const resp = await axios.post(`${GOOGLE_API_HOST}/place/findplacefromtext/json?input=${address} ${name}&inputtype=textquery&fields=place_id&key=${GOOGLE_KEY}`)
    const { candidates } = resp.data

    return candidates && candidates.length > 0 ? candidates[0].place_id : null
}
    
module.exports.getPlaceDetails = async (id) => {

    const resp = await axios.get(`${GOOGLE_API_HOST}/place/details/json?place_id=${id}&fields=reviews,website,opening_hours,icon,rating,price_level&key=${GOOGLE_KEY}`)
    const { result } = resp.data

    const opening_hours = getDetail('opening_hours', result)

    return { 
        timings: opening_hours ? opening_hours.weekday_text : null, 
        reviews: getDetail('reviews', result),
        website: getDetail('website', result),
        icon: getDetail('icon', result),
        rating: getDetail('rating', result),
        price_level: getDetail('price_level', result)
    }
}