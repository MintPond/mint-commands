'use strict';

const
    precon = require('@mintpond/mint-precon'),
    mu = require('@mintpond/mint-utils'),
    pu = require('@mintpond/mint-utils').prototypes;


class CommandParameter {

    /**
     * Constructor
     *
     * @param param {string|{}}
     * @param [isFlag] {boolean}
     */
    constructor(param, isFlag) {
        precon.notNull(param, 'param');
        precon.opt_boolean(isFlag, 'isFlag');

        const _ = this;

        if (mu.isString(param)) {

            const parts = param.split('=');
            _._name = parts[0];
            _._hasDefaultValue = parts.length > 1;
            parts.shift();
            _._defaultValue = parts.length ? parts.join('=') : isFlag ? false : '';
            _._description = '';
        }
        else if (mu.isObject(param)) {

            precon.string(param.name, 'name');
            if (isFlag) {
                precon.undef(param.defaultValue, 'defaultValue');
            }
            else {
                precon.opt_string(param.defaultValue, 'defaultValue');
            }
            precon.opt_string(param.description, 'description');

            _._name = param.name;
            _._hasDefaultValue = isFlag ? false : mu.isString(param.defaultValue);
            _._defaultValue = isFlag ? false : param.defaultValue || '';
            _._description = param.description || '';
            Object.keys(param).forEach(propName => {

                if (propName[0] === '_')
                    return; // continue

                switch (propName) {
                    case 'name':
                    case 'defaultValue':
                    case 'description':
                        break;
                    default:
                        _[propName] = param[propName];
                        break;
                }
            });
        }
        else {
            throw new Error('Invalid parameter');
        }
    }


    /**
     * The name of the parameter.
     * @returns {string}
     */
    get name() { return this._name; }

    /**
     * Determine if the parameter has a default value defined.
     * @returns {boolean}
     */
    get hasDefaultValue() { return this._hasDefaultValue; }

    /**
     * Get the default argument value.
     * @returns {string}
     */
    get defaultValue() { return this._defaultValue; }

    /**
     * Get the description of the parameter to use in help definitions.
     * @returns {string}
     */
    get description() { return this._description; }
    set description(descr) {
        precon.string(descr, 'description');
        this._description = descr;
    }


    toJSON() {
        const _ = this;
        return {
            name: _.name,
            defaultValue: _.defaultValue,
            description: _.description
        };
    }


    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfByName(obj, 'CommandParameter') &&
            pu.hasGetters(obj, 'name', 'hasDefaultValue', 'defaultValue', 'description');
    }
}

module.exports = CommandParameter;