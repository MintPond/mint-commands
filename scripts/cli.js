#!/usr/bin/env node
/**
 * This is a script used to send commands to a CLI server.
 *
 * eg: ./cli.js category1 command1 arg1 arg2 --flag
 */
'use strict';

const host = '127.0.0.1';
const port = 2020;
const queryArr = process.argv.slice(2);

const net = require('net');

const client = net.connect(port, host, () => {

    client.on('error', err => {

        if (err.code === 'ECONNREFUSED') {
            console.log(`Could not connect to MintPond instance at ${host}:${port}`);
        }
        else {
            console.log(`Socket error ${JSON.stringify(err)}`);
        }
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
            console.log('');

            if (Array.isArray(response)) {

                response.forEach(item => {
                    if (typeof item === 'string') {
                        console.log(_indentLines(item) + '\n');
                    }
                    else {
                        console.log(_indentLines(JSON.stringify(item, null, 4)));
                    }
                });
            }
            else {
                if (typeof response === 'string') {
                    console.log(_indentLines(response) + '\n');
                }
                else {
                    console.log(_indentLines(JSON.stringify(response, null, 4)));
                }
            }
            client.end();
        }
    });

    client.write(JSON.stringify({
        id: 0,
        query: queryArr
    }) + '\n');
});

client.on('close', () => {
    setTimeout(() => {
        process.exit(0);
    }, 1);
});


function _indentLines(str) {
    return str.split('\n').map(line => {
        return '    ' + line;
    }).join('\n');
}