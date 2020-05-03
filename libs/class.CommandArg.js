'use strict';

const
    precon = require('@mintpond/mint-precon'),
    mu = require('@mintpond/mint-utils'),
    pu = require('@mintpond/mint-utils').prototypes,
    CommandParameter = require('./class.CommandParameter');


/**
 * A parsed argument for a CommandParameter.
 */
class CommandArg {

    /**
     * Constructor.
     *
     * @param parameter {CommandParameter} The parameter the argument is for.
     * @param value {string|boolean} The argument value.
     */
    constructor(parameter, value) {
        precon.instanceOf(parameter, CommandParameter, 'parameter');

        const _ = this;
        const isDefaultValue = (!mu.isString(value) && !mu.isBoolean(value)) || value === '' || value === false;
        _._parameter = parameter;
        _._value = isDefaultValue ? parameter.defaultValue : value;
        _._isDefaultValue = isDefaultValue;
    }


    /**
     * The name of the parameter the argument is for.
     * @returns {string}
     */
    get name() { return this._parameter.name; }

    /**
     * The parameter the argument is for.
     * @returns {CommandParameter}
     */
    get parameter() { return this._parameter; }

    /**
     * The parsed argument value.
     * @returns {string}
     */
    get value() { return this._value; }

    /**
     * Determine if the argument value is the default value.
     *
     * This will return true only if no value was provided. If the value provided is the same as the default value then
     * this will still return false.
     * @returns {boolean}
     */
    get isDefaultValue() { return this._isDefaultValue; }


    toJSON() {
        const _ = this;
        return {
            name: _.name,
            value: _.value,
            isDefaultValue: _.isDefaultValue
        };
    }


    static get CLASS_ID() { return '2071f2d2438e2e402e88706a9ddc8851961001b81104606f8ad9e8c109f340ad'; }
    static TEST_INSTANCE(CommandArg) {
        const parameter = new CommandParameter('param');
        return new CommandArg(parameter, '');
    }
    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfById(obj, CommandArg.CLASS_ID);
    }
}

module.exports = CommandArg;