/* istanbul ignore file */

'use strict';

const {
    app,
} = require('./app');

const {
    configuration,
} = require('./configuration');

app.listen(configuration.server.port, (error) => {
    if (error) {
        console.log(error);
        process.exit(1); // eslint-disable-line no-process-exit
    }

    console.log(`Agora is listening on port ${configuration.server.port}`);
});
