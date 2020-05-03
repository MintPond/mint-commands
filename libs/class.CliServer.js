'use strict';

const
    EventEmitter = require('events'),
    net = require('net'),
    precon = require('@mintpond/mint-precon'),
    mu = require('@mintpond/mint-utils'),
    pu = require('@mintpond/mint-utils').prototypes,
    CommandDispatcher = require('./class.CommandDispatcher');

/**
 * A server to receive and execute commands.
 */
class CliServer extends EventEmitter {

    /**
     * Constructor.
     *
     * @param args
     * @param args.cmdDispatcher {CommandDispatcher}
     */
    constructor(args) {
        precon.instanceOf(args.cmdDispatcher, CommandDispatcher, 'cmdDispatcher');

        super();

        const _ = this;
        _._cmdDispatcher = args.cmdDispatcher;

        _._clientId = 0;
        _._server = null;
        _._clientsMap = new Map();
    }


    /**
     * Name of the event emitted when a command is received.
     * @returns {string}
     */
    static get EVENT_CMD_RECEIVED() { return 'cmdReceived'; }

    /**
     * Name of the event emitted when an unparsable command is received.
     * @returns {string}
     */
    static get EVENT_INVALID_CMD_RECEIVED() { return 'invalidCmdReceived'; }

    /**
     * Name of the event emitted when a socket error occurs.
     * @returns {string}
     */
    static get EVENT_SOCKET_ERROR() { return 'socketError'; }



    /**
     * Start server.
     *
     * @param host {string}
     * @param port {number}
     * @param [callback] {function()}
     */
    start(host, port, callback) {
        precon.string(host, 'host');
        precon.minMaxInteger(port, 1, 65535, 'port');
        precon.opt_funct(callback, 'callback');

        const _ = this;

        if (_._server)
            throw new Error('CLI server is already started.');

        _._server = net.createServer(_._onClientConnect.bind(_));
        _._server.listen(port, host, () => {
            callback && callback();
        });
    }


    /**
     * Stop server.
     *
     * @param [callback] {function()}
     */
    stop(callback) {
        precon.opt_funct(callback, 'callback');

        const _ = this;
        if (_._server) {
            _._server.close(() => {
                callback && setImmediate(callback);
                callback = null;
            });

            for (const client of _._clientsMap.values()) {
                client.destroy();
            }
            _._server = null;
        }
        else {
            callback && setImmediate(callback);
        }
    }


    _onClientConnect(socket) {

        const _ = this;

        _._clientId++;
        socket.clientId = _._clientId;
        _._clientsMap.set(socket.clientId, socket);

        let stringBuffer = '';

        // DATA
        socket.on('data', data => {

            if (!data)
                return;

            stringBuffer += data.toString();
            if (stringBuffer.endsWith('\n')) {

                const parts = stringBuffer.split('\n');
                stringBuffer = '';

                parts.forEach(json => {

                    if (!json)
                        return;

                    const message = _parseJSON(json);
                    if (message) {

                        _.emit(CliServer.EVENT_CMD_RECEIVED, { message: message, ip: socket.remoteAddress, json: json });

                        _._executeCommand(message, (err, repliesArr) => {
                            if (err) {
                                socket.write(`${message.id || 0}:\n${JSON.stringify(err)}\n\n`);
                            }
                            else {
                                socket.write(`${message.id || 0}:\n${JSON.stringify(repliesArr)}\n\n`);
                            }
                        });

                    } else {
                        _.emit(CliServer.EVENT_INVALID_CMD_RECEIVED, { ip: socket.remoteAddress, json: json });
                    }
                });
            }

        });

        // ERROR
        socket.on('error', err => {
            const _ = this;
            if (err.code !== 'ECONNRESET') {
                _.emit(CliServer.EVENT_SOCKET_ERROR, { error: err, ip: socket.remoteAddress });
            }
        });

        socket.on('close', () => {
            const _ = this;
            _._clientsMap.delete(socket.clientId);
        });
    }


    _executeCommand(message, callback) {
        const _ = this;
        if (!Array.isArray(message.query) && !mu.isString(message.query)) {
            callback('Invalid message format.');
            return;
        }

        let parsed;

        try {
            parsed = _._cmdDispatcher.parseQuery(message.query);
        }
        catch (err) {
            if (err.isCommandError) {
                callback(err.message);
                return;
            }
            throw err;
        }

        if (parsed === false) {
            callback('Command not found');
        }
        else if (parsed.isHelp) {
            try {
                _._cmdDispatcher.help(parsed.path, (err, helpStr) => {
                    callback(err, [helpStr]);
                });
            }
            catch (err) {
                callback({
                    msg: 'Exception while executing CLI command help',
                    path: parsed.path,
                    error: err.toString(),
                    stack: err.stack
                });
            }
        }
        else {
            try {
                _._cmdDispatcher.execute(parsed.path, parsed.argsOMap, callback);
            }
            catch (err) {
                callback({
                    msg: 'Exception while executing CLI command',
                    path: parsed.path,
                    argsOMap: parsed.argsOMap,
                    error: err.toString(),
                    stack: err.stack
                });
            }
        }
    }


    static get CLASS_ID() { return '5c7a53e02e2ee02b878b5c20e589af10c0ce4bf3635a6eb400fdfb493569f405'; }
    static TEST_INSTANCE(CliServer) {
        const dispatcher = new CommandDispatcher();
        return new CliServer({ cmdDispatcher: dispatcher });
    }
    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfById(obj, CliServer.CLASS_ID);
    }
}


function _parseJSON(json) {
    try {
        return JSON.parse(json);
    }
    catch (err) {
        return false;
    }
}


module.exports = CliServer;