module.exports = ({ env }) => ({
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337)
    // admin: {
    //     path: '/',
    //     serveAdminPanel: false,
    //     build: {
    //         backend: 'http://test.api.offerize.xyz'
    //     }
    // }
})