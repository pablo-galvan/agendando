'use strict';

module.exports = {
    timeout: 20000,
    test: {
        host: 'https://jsonplaceholder.typicode.com'
    },
    bort: {
        host: 'http://stage.bort.cuponstar.com/api'
    },
    weather: {
        host: 'http://api.apixu.com/v1',
        apiKey: '409167ff741942d9a59201326170304'
    },
    vale: {
        host: 'http://vale.stage.cuponstar.com/api'
    },
    cupona: {
        host: 'https://soleil.cupona.com/api'
    },
    facebook: {
        host: 'https://graph.facebook.com',
        appId: '1541578079439752',
        secret: '12740b437a11ebfc79a0c1fe73eff07c',
        'redirect_uri': 'http://localhost:9090/'
    }
};