module.exports.cleanMerchant = (rawMerchant) => {

    let merchant = {}
    const attrs = strapi.models.merchant.attributes

    Object.keys(rawMerchant).forEach(field => {
        if (attrs[field]) merchant[field] = rawMerchant[field]
    })

    return merchant
}
    
module.exports.getCoord = (type, results) => {
    return results[0] && results[0].geometry ? results[0].geometry.location[type] : null
}
    
module.exports.getDetail = (type, result) => {
    return result && result[type] ? result[type] : null
}