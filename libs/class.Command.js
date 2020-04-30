'use strict';

const
    precon = require('@mintpond/mint-precon'),
    pu = require('@mintpond/mint-utils').prototypes,
    CommandParameter = require('./class.CommandParameter');


/**
 * A command definition
 */
class Command {

    /**
     * Constructor.
     *
     * @param args
     * @param args.path {string}
     * @param [args.params] {string[]}
     * @param [args.options] {string[]}
     * @param [args.flags] {string[]}
     * @param [args.extra] {{}}
     * @param [args.description] {string}
     * @param [args.execute] {function(args:{},finish:function(err:object,result:object))}
     */
    constructor(args) {
        precon.string(args.path, 'path');
        precon.opt_array(args.params, 'params');
        precon.opt_array(args.options, 'options');
        precon.opt_array(args.flags, 'flags');
        precon.opt_obj(args.extra, 'extra');
        precon.opt_string(args.description, 'description');
        precon.opt_funct(args.execute, 'execute');

        const _ = this;
        _._path = args.path;
        _._paramsOMap = {};
        _._paramsArr = (args.params || []).map(param => {
            param = param instanceof CommandParameter ? param : new CommandParameter(param);
            _._paramsOMap[param.name] = param;
            return param;
        });
        _._optionsOMap = {};
        _._optionsArr = (args.options || []).map(param => {
            param = param instanceof CommandParameter ? param : new CommandParameter(param);
            _._optionsOMap[param.name] = param;
            return param;
        });
        _._flagsOMap = {};
        _._flagsArr = (args.flags || []).map(param => {
            param = param instanceof CommandParameter ? param : new CommandParameter(param, true/*isFlag*/);
            _._paramsOMap[param.name] = param;
            return param;
        });
        _._extra = args.extra || {};
        _._description = args.description || '';
        _._executeCallback = args.execute || ((args, finish) => {
            finish();
        });
    }


    /**
     * The period delimited command path. The path is used to categorize commands and break them up into smaller easier
     * to display help lists. (i.e. 'bigsys.subsystem.commandName'). Only lowercase letters should be used.
     * @returns {string}
     */
    get path() { return this._path; }

    /**
     * An array of parameters whose arguments are expected as a series of arguments after the command whose order will
     * map the the order of parameters in the array.
     * @returns {CommandParameter[]}
     */
    get paramsArr() { return this._paramsArr; }

    /**
     * An array of parameters options whose arguments are expected as a dash and name of the parameter followed by the
     * argument. (i.e. 'command -param1 arg1')
     * @returns {CommandParameter[]}
     */
    get optionsArr() { return this._optionsArr; }

    /**
     * An array of parameter flags whose arguments are expected as a double dash and name of the parameter to indicate
     * true. The absence of the parameter flag indicates false.
     * argument. (i.e. 'command --flag1')
     * @returns {CommandParameter[]}
     */
    get flagsArr() { return this._flagsArr; }

    /**
     * A description of the parameter for use in the auto generated usage.
     * @returns {string}
     */
    get description() { return this._description; }

    /**
     * An auto generated usage description.
     * @returns {string}
     */
    get usage() { return this.$generateUsage(); }

    /**
     * An auto generated usage description with more verbose information.
     * @returns {string}
     */
    get verboseUsage() { return this.$generateVerboseUsage(); }

    /**
     * An object containing extra data associated with the command.
     * @returns {{}}
     */
    get extra() { return this._extra; }


    /**
     * Execute the command using an object map of arguments.
     *
     * @param argMap {{}} An object map containing arguments to pass into the command.
     * @param callback {function(error:*,result:*)} A function to be called when the
     * command execution is completed and to pass a result back.
     */
    execute(argMap, callback) {
        precon.obj(argMap, 'argMap');
        precon.funct(callback, 'callback');

        const _ = this;
        try {
            _._executeCallback(argMap, callback);
        }
        catch(err) {
            callback(err.stack, null);
        }
    }


    toJSON() {
        const _ = this;
        return {
            path: _.path,
            params: _.params,
            options: _.options,
            flags: _.flags,
            extra: _.extra,
            usage: _.usage,
            description: _.description
        };
    }


    $generateUsage() {

        const _ = this;
        const pathArray = _._path.split('.');
        const name = pathArray[pathArray.length - 1];
        const rootPath = pathArray.splice(0);
        rootPath.pop();

        const buffer = [];

        buffer.push(rootPath.join(' '));
        buffer.push(name);

        // params
        _._paramsArr.forEach(param => {
            const isRequired = !param.hasDefaultValue;
            buffer.push(`${isRequired ? '<' : '['}${param.name}${isRequired ? '>' : ']'}`);
        });

        // options
        _._optionsArr.forEach(option => {
            buffer.push(`[-${option.name}]`);
        });

        // flags
        _._flagsArr.forEach(option => {
            buffer.push(`[--${option.name}]`);
        });

        return buffer.join(' ');
    }


    $generateVerboseUsage() {

        const _ = this;

        const buffer = [_.$generateUsage(), '\n'];
        buffer.push(`${_._description}`);

        const paramsArr = _._paramsArr.filter(param => !!param.description);
        if (paramsArr.length) {
            buffer.push('\n');
            paramsArr.forEach(param => {
                if (param.hasDefaultValue) {
                    buffer.push(`  ${param.name} - ${param.description}\n`);
                }
                else {
                    buffer.push(`  ${param.name}=${param.defaultValue} - ${param.description}\n`);
                }
            });
        }

        const optionsArr = _._optionsArr.filter(option => !!option.description);
        if (optionsArr.length) {
            buffer.push('\n');
            optionsArr.forEach(param => {
                if (param.hasDefaultValue) {
                    buffer.push(`  -${param.name} <value> - ${param.description}\n`)
                }
                else {
                    buffer.push(`  -${param.name} <value=${param.defaultValue}> - ${param.description}\n`)
                }
            });
        }

        const flagsArr = _._flagsArr.filter(flag => !!flag.description);
        if (flagsArr.length) {
            buffer.push('\n');
            flagsArr.forEach(param => {
                buffer.push(`  --${param.name} - ${param.description}\n`)
            });
        }

        return buffer.join('');
    }


    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfByName(obj, 'Command') &&
            pu.isFunction(obj.execute) &&
            pu.hasGetters(obj, 'path', 'paramsArr', 'optionsArr', 'flagsArr', 'description',
                'usage', 'verboseUsage', 'extra');
    }
}

module.exports = Command;