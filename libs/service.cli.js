'use strict';

const
    net = require('net'),
    precon = require('@mintpond/mint-precon');


/**
 * Send a command to a listening CliServer.
 *
 * @param args
 * @param args.query {string} A command query
 * @param args.host {string} The host to connect to.
 * @param args.port {number} The port to connect to.
 * @param [args.callback] {function(err:*,result:*)}
 */
module.exports = function(args) {
    precon.string(args.query, 'query');
    precon.string(args.host, 'host');
    precon.minMaxInteger(args.port, 1, 65535, 'port');
    precon.opt_funct(args.callback, 'callback');

    const host = args.host;
    const port = args.port;
    const query = args.query;
    let callback = args.callback;

    const client = net.connect(port, host, () => {

        client.on('error', err => {
            callback && callback(err);
            callback = null;
        });

        const bufferArr = [];

        client.on('data', data => {

            data = data.toString();
            bufferArr.push(data);
            if (data.endsWith('\n\n')) {

                data = bufferArr.join('');

                const parts = data.split('\n');
                var response = parts[1];

                try {
                    response = JSON.parse(response);
                }
                catch(err) {}

                bufferArr.length = 0;

                callback && callback(null, response);
                callback = null;

                client.end();
            }
        });

        client.write(JSON.stringify({
            id: 0,
            query: query
        }) + '\n');
    });

    client.on('close', () => {
        callback && callback();
        callback = null;
    });
}


