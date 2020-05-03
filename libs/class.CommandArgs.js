'use strict';

const
    precon = require('@mintpond/mint-precon'),
    pu = require('@mintpond/mint-utils').prototypes,
    Command = require('./class.Command'),
    CommandArg = require('./class.CommandArg');


/**
 * Parsed command arguments.
 */
class CommandArgs {

    /**
     * Constructor.
     *
     * @param command {Command} The command the arguments are for.
     * @param [args] {{params:CommandArg[],options:{},flags:{}}}
     */
    constructor(command, args) {
        precon.instanceOf(command, Command, 'command');
        precon.opt_obj(args, 'args');

        args = args || {};
        precon.opt_array(args.params, 'args.params');
        precon.opt_obj(args.options, 'args.options');
        precon.opt_obj(args.flags, 'args.flags');

        const _ = this;
        _._paramsArr = args.params || [];
        _._optionsOMap = args.options || {};
        _._flagsOMap = args.flags || {};
        _._argsOMap = {};

        _._paramsArr.forEach((arg, i) => {
            const param = command.paramsArr[i];
            if (param) {
                _._argsOMap[param.name] = arg ? arg.value : param.defaultValue;
            }
        });

        Object.keys(_._optionsOMap).forEach(name => {
            _._argsOMap[name] = _._optionsOMap[name].value;
        });

        command.flagsArr.forEach(flag => {
            let arg = _._flagsOMap[flag.name];
            if (!arg)
                arg = new CommandArg(flag, false);

            _._flagsOMap[flag.name] = arg;
            _._argsOMap[flag.name] = arg.value;
        });
    }


    /**
     * Get parameter arguments array.
     * @returns {CommandArg[]}
     */
    get paramsArr() { return this._paramsArr; }

    /**
     * Get options arguments in an object map of CommandArg by parameter name.
     * @returns {{}}
     */
    get optionsOMap() { return this._optionsOMap; }

    /**
     * Get flags in an object map of booleans by parameter name.
     * @returns {{}}
     */
    get flagsOMap() { return this._flagsOMap; }

    /**
     * Get all argument values in an object map by parameter name.
     * @returns {{}}
     */
    get argsOMap() { return this._argsOMap; }


    toJSON() {
        const _ = this;
        return {
            params: _.paramsArr,
            options: _.optionsOMap,
            flags: _.flagsOMap,
            args: _.argsOMap
        };
    }


    static get CLASS_ID() { return '6554229d370ac711a9964748a9dc3767ad8f22e7e7f553be52f8cd9c39be4993'; }
    static TEST_INSTANCE(CommandArgs) {
        const command = new Command({ path: 'test' });
        return new CommandArgs(command);
    }
    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfById(obj, CommandArgs.CLASS_ID);
    }
}

module.exports = CommandArgs;