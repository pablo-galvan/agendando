'use strict';

module.exports = {
    ssr: true,
    name: 'agendando',
    memwatch: {
        enabled: true,
        leakWatch: true,
        gc: {
            timing: 30000
        }
    }
};
