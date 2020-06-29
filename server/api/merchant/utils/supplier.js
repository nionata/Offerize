const axios = require('axios')

module.exports.getSuppliers = async (lat, long, mcc) => {
      
    const resp = await axios.post(`https://www.visa.com/supplierlocator-app/rest/search/supplier/desktop?lat=${lat}&lon=${long}&distLat=${lat}&distLon=${long}&text=&is=&mcc=${mcc}`)
    const { data } = resp.data

    return data && data.length > 0 ? data[0].list : null
}
