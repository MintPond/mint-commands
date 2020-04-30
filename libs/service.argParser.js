'use strict';

const
    precon = require('@mintpond/mint-precon'),
    CommandArg = require('./class.CommandArg'),
    CommandArgs = require('./class.CommandArgs'),
    CommandError = require('./class.CommandError');

const COMMON_PREFIX = '-';
const FLAG_PREFIX = COMMON_PREFIX + COMMON_PREFIX;


module.exports = {

    /**
     * Parse array of arguments..
     *
     * @param command {Command} The command the arguments are for.
     * @param args {string[]} Array of argument values (split by space character)
     * @returns {CommandArgs}
     */
    parse: parse
};


function parse(command, args) {
    precon.notNull(command, 'command');
    precon.arrayOf(args, 'string', 'args');

    const argResults = new CommandArgs(command);

    const cmdArgsArr = args.slice(0);
    const parametersArr = command.paramsArr.slice(0);

    // parse arguments for parameters
    _parseParameters(command, argResults, parametersArr, cmdArgsArr);

    // check if there are options for the command
    if (!command.optionsArr.length && !command.flagsArr.length) {

        // if there are no more parameters but there are still arguments left,
        // then there are too many arguments.
        if (cmdArgsArr.length)
            throw new CommandError('Too many arguments');

        // nothing left to do
        return argResults;
    }

    // get ready to parse options and flag parameters
    const optionsOMap = _createOMap(command.optionsArr);
    const flagsOMap = _createOMap(command.flagsArr);

    // parse arguments for non-static parameters.
    _parseOptionsAndFlags(command, argResults, optionsOMap, flagsOMap, cmdArgsArr);

    return argResults;
}


function _parseParameters(command, argResults, parametersArr, cmdArgsArr) {

    while (parametersArr.length) {

        const parameter = parametersArr.shift();

        const paramName = parameter.name;
        let value = null;

        if (cmdArgsArr.length) {

            const arg = cmdArgsArr.shift() || '';

            // Should not be any options or flag parameters before required arguments
            if (arg.startsWith(COMMON_PREFIX)) {

                // the last parameter might be optional, in which
                // case it should have a default value.

                // If there are still more static parameters, it means this
                // is not the last parameter but the expected argument was not provided.
                if (parametersArr.length) {
                    throw new CommandError(`Missing required argument for parameter: ${parameter.name}`, {
                        missingParamName: parameter.name,
                        missingParam: parameter
                    });
                }

                // No default value defined means a discreet value is expected.
                if (!parameter.hasDefaultValue) {
                    throw new CommandError(`Missing required argument for parameter: ${parameter.name}`, {
                        missingParamName: parameter.name,
                        missingParam: parameter
                    });
                }

                // re-insert option argument so the other parsers
                // will see it. Since this is the last parameter,
                // this is the end of the loop.
                cmdArgsArr.unshift(arg);
            }
            else {
                value = _parseArgValue(arg, cmdArgsArr);
            }
        }

        // add argument
        if (value !== null || parameter.hasDefaultValue) {

            const commandArg = new CommandArg(parameter, value);

            if (paramName in argResults.argsOMap) {
                throw new CommandError(`Duplicate argument for parameter: ${parameter.name}`, {
                    missingParamName: parameter.name,
                    missingParam: parameter
                });
            }

            argResults.paramsArr.push(commandArg);
            argResults.argsOMap[paramName] = commandArg.value;
        }
        else {
            throw new CommandError(`Missing required argument for parameter: ${parameter.name}`, {
                missingParamName: parameter.name,
                missingParam: parameter
            });
        }
    }
}


function _parseOptionsAndFlags(command, argResults, optionsOMap, flagsOMap, cmdArgs) {

    while (cmdArgs.length) {

        let paramName = cmdArgs.shift();

        if (!paramName.startsWith(COMMON_PREFIX))
            throw new CommandError(`Too many arguments ${JSON.stringify(cmdArgs)}`);

        // check for flag
        if (paramName.startsWith(FLAG_PREFIX)) {

            paramName = paramName.substr(FLAG_PREFIX.length);

            if (!(paramName in flagsOMap)) {

                if (paramName in argResults.flags) {
                    // flag was already added
                    throw new CommandError(`Duplicate argument for parameter: ${paramName}`);
                }

                // unknown flag
                throw new CommandError(`Invalid flag: ${paramName}`);
            }

            const commandArg = new CommandArg(flagsOMap[paramName], true);
            delete flagsOMap[paramName];

            argResults.flagsOMap[paramName] = commandArg;
            argResults.argsOMap[paramName] = commandArg.value;
        }
        // check for option parameter
        else if (paramName.startsWith(COMMON_PREFIX)) {

            paramName = paramName.substring(COMMON_PREFIX.length);

            if (!(paramName in optionsOMap))
                throw new CommandError(`Unrecognized option: ${paramName}`);

            if (!cmdArgs.length)
                throw new CommandError(`Duplicate argument for option: ${paramName}`);

            const arg = _parseArgValue(cmdArgs.shift(), cmdArgs);
            const commandArg = new CommandArg(optionsOMap[paramName], arg);

            delete optionsOMap[paramName];

            argResults.optionsOMap[paramName] = commandArg;
            argResults.argsOMap[paramName] = commandArg.value;
        }
    }

    // add missing arguments if default or error on missing required arg

    Object.keys(optionsOMap).forEach(optionName => {
        const opt = optionsOMap[optionName];
        const commandArg = new CommandArg(opt, '');
        argResults.optionsOMap[opt.name] = commandArg;
        argResults.argsOMap[opt.name] = commandArg.value;
    });
}


function _parseArgValue(arg, cmdArgs) {

    // check to see if parsing a literal
    let quote = null;

    // double quote
    if (arg[0] === '"') {
        quote = '"';
    }
    // single quote
    else if (arg[0] === '\'') {
        quote = '\'';
    }
    // tilde quote
    else if (arg[0] === '`') {
        quote = '`';
    }

    if (quote === null)
        return arg; // value is unquoted argument

    // value is quoted literal

    const firstWord = arg.substr(1); // remove starting quotation

    // make sure the literal isn't closed on the same word
    if (firstWord.endsWith(quote)) {
        // remove end quote.
        return firstWord.substr(0, firstWord.length - 1);
    }

    // otherwise parse ahead until end of literal

    const literal = [];
    literal.push(firstWord);

    while (cmdArgs.length) {
        let nextArg = cmdArgs.shift();

        // check if this is the final word in the literal
        if (nextArg.endsWith(quote)) {

            // remove end quote
            nextArg = nextArg.substr(0, nextArg.length - 1);

            literal.push(nextArg);
            break;
        }

        literal.push(nextArg);
    }

    return literal.join(' ');
}


function _createOMap(collection) {

    const result = {};

    collection.forEach(item => {
        result[item.name] = item;
    });

    return result;
}

