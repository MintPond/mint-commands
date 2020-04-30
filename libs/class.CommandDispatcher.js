'use strict';

const
    precon = require('@mintpond/mint-precon'),
    pu = require('@mintpond/mint-utils').prototypes,
    Category = require('./class.Category'),
    argParser = require('./service.argParser'),
    cmdParser = require('./service.cmdParser'),
    Commands = require('./class.Commands.js');


class CommandDispatcher {

    /**
     * Constructor.
     */
    constructor(commands) {
        precon.opt_instanceOf(commands, Commands, 'commands');

        const _ = this;
        _._commands = commands || new Commands();
    }


    /**
     * Add a command to the dispatcher.
     *
     * @param definition {object} The command definition.
     * @param definition.path {string}
     * @param [definition.params] {string[]}
     * @param [definition.options] {string[]}
     * @param [definition.flags] {string[]}
     * @param [definition.description] {string}
     * @param definition.execute {function(args:object, done:function())}
     * @returns {Command}
     */
    addCommand(definition) {
        precon.notNull(definition, 'definition');

        const _ = this;
        return _._commands.define(definition);
    }


    /**
     * Parse a command query.
     *
     * @param query {string[]|string}
     * @returns {boolean|{path: string, argOMap: {}, isHelp: boolean}}
     */
    parseQuery(query) {

        const _ = this;
        const inputArr = Array.isArray(query) ? query : query.split(' ');
        const parsed = cmdParser.parse(_._commands, inputArr);

        if (!parsed.path && parsed.isHelp) {
            return {
                path: '',
                argsOMap: {},
                isHelp: true
            };
        }

        const cmd = _._commands.get(parsed.path);
        if (!cmd)
            return false;

        if (parsed.isHelp || cmd instanceof Category) {
            return {
                path: cmd.path || '',
                argsOMap: {},
                isHelp: true
            };
        }

        const parsedArgs = argParser.parse(cmd, parsed.args);

        return {
            path: parsed.path,
            argsOMap: parsedArgs.argsOMap,
            isHelp: false
        };
    }


    /**
     * Execute a registered command.
     *
     * @param path {string} The command path.
     * @param argsOMap {object} An object containing arguments mapped to parameter name.
     * @param callback {function(err:*,result:*[])}
     * @returns {boolean}
     */
    execute(path, argsOMap, callback) {
        precon.string(path, 'path');
        precon.obj(argsOMap, 'argsOMap');
        precon.opt_funct(callback, 'callback');

        const _ = this;
        const command = _._commands.get(path);
        if (!command) {
            callback && callback('Command not found', null);
            return false;
        }

        if (command instanceof Category) {
            callback && callback('Cannot execute category', null);
            return false;
        }

        _.$onExecuteCommand(command, argsOMap, callback);

        return true;
    }


    /**
     * Generate a help string for the specified command path.
     *
     * @param path {string} The command path.
     * @param callback {function(err:*,help:string)}
     */
    help(path, callback) {
        precon.string(path, 'path');
        precon.opt_funct(callback, 'callback');

        const _ = this;
        const allCommandsArr = _._commands.getAll(path, 1);
        const commandsArr = [];
        const categoryArr = [];

        // find categories
        allCommandsArr.forEach(command => {
            if (command instanceof Category) {
                if (command.path !== path)
                    categoryArr.push(command);
            }
            else {
                commandsArr.push(command);
            }
        });

        const bufferArr = [];

        if (commandsArr.length === 1 && categoryArr.length === 0) {
            bufferArr.push(_.$getCommandVerboseUsageHelpStr(commandsArr[0]));
        }
        else {
            commandsArr.forEach(command => {
                bufferArr.push(_.$getCommandUsageHelpStr(command));
            });

            categoryArr.forEach(category => {
                bufferArr.push(_.$getCommandCategoryHelpStr(category.path));
            });
        }

        callback && callback(null, bufferArr.join('\n'));
    }


    $onExecuteCommand(command, argOMap, done) {
        command.execute(argOMap, done);
    }


    $getCommandUsageHelpStr(command) {
        return ` > ${command.path.split('.').pop()}\n   USAGE: ${command.usage}\n   DESCR: ${command.description}\n`;
    }


    $getCommandVerboseUsageHelpStr(command) {
        return command.verboseUsage;
    }


    $getCommandCategoryHelpStr(categoryPath) {
        return `>> ${categoryPath.split('.').join(' ')} [?]\n`;
    }


    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfByName(obj, 'CommandDispatcher') &&
            pu.isFunction(obj.addCommand) &&
            pu.isFunction(obj.parseQuery) &&
            pu.isFunction(obj.execute) &&
            pu.isFunction(obj.help);
    }
}

module.exports = CommandDispatcher;