'use strict';

const
    precon = require('@mintpond/mint-precon'),
    Commands = require('./class.Commands');

module.exports = {

    /**
     * Parse a command query that has been split into a string array of commands and arguments.
     *
     * @param commands {Commands}
     * @param argsArr {string[]}
     * @returns {{args: [], path: string, isHelp: boolean}}
     */
    parse: parse
}


function parse(commands, argsArr) {
    precon.instanceOf(commands, Commands, 'commands');
    precon.arrayOf(argsArr, 'string', 'args');

    return _parse(commands, [], argsArr);
}


function _parse(commands, commandPathArr, argsArr) {

    if (argsArr.length === 0 || !argsArr[0]) {
        return {
            path: commandPathArr.join('.').toLowerCase(),
            args: [],
            isHelp: false
        };
    }

    const subCmd = argsArr[0];
    const subCmdPath = commandPathArr.slice(0);

    subCmdPath.push(subCmd);
    const subCmdPathStr = subCmdPath.join('.').toLowerCase();

    // command not found
    if (!commands.isPath(subCmdPathStr)) {

        if (subCmd === '?' || subCmd === '--help') {
            return {
                path: commandPathArr.join('.').toLowerCase(),
                args: [],
                isHelp: true
            };
        }

        return {
            path: commandPathArr.join('.').toLowerCase(),
            args: argsArr,
            isHelp: false
        };
    }

    // trim first arg (its a command now)
    argsArr = argsArr.slice(1);

    return _parse(commands, subCmdPath, argsArr);
}