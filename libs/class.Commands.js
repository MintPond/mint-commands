'use strict';

const
    precon = require('@mintpond/mint-precon'),
    pu = require('@mintpond/mint-utils').prototypes,
    Category = require('./class.Category'),
    Command = require('./class.Command');


/**
 * A collection of Commands.
 */
class Commands {

    /**
     * Constructor.
     */
    constructor() {
        const _ = this;
        _._pathSet = new Set();
        _._commandMap = new Map();
    }


    /**
     * Array of command paths.
     * @returns {string[]}
     */
    get pathsArr() { return Array.from(this._commandMap.keys()); }


    /**
     * Define a command.
     *
     * @param definition
     * @param definition.path {string}
     * @param definition.params {string[]}
     * @param definition.flags {string[]}
     * @param definition.description {string}
     * @param definition.execute {function(args:{}, done:function(err:*, result:*))}
     * @returns {Command}
     */
    define(definition) {
        precon.notNull(definition, 'definition');

        const _ = this;
        _._addPathsAndCategories(definition.path);
        const cmd = _.$createCommand(definition);
        _._commandMap.set(definition.path, cmd);
        return cmd;
    }


    /**
     * Get a command by path.
     *
     * @param path {string}
     * @returns {undefined|Command}
     */
    get(path) {
        precon.string(path, 'path');

        const _ = this;
        return _._commandMap.get(path);
    }


    /**
     * Get all commands that match or are children of the specified command path.
     *
     * @param path {string}
     * @param [maxSubDepth] {number} The maximum depth of commands in addition to the path commands.
     * @returns {Command[]}
     */
    getAll(path, maxSubDepth) {
        precon.string(path, 'path');
        precon.opt_positiveInteger(maxSubDepth, 'maxSubDepth');

        const _ = this;
        const resultArr = [];
        for (const [p, command] of _._commandMap.entries()) {
            if (!p.startsWith(path))
                continue;

            if (maxSubDepth) {
                const subPath = p.substr(path.length + 1/*period*/) || '';
                if (subPath) {
                    const subParts = subPath.split('.');
                    if (subParts.length > maxSubDepth) {
                        continue;
                    }
                }
            }

            resultArr.push(command);
        }
        return resultArr;
    }


    /**
     * Determine if a path is a valid category or command.
     *
     * @param path {string}
     * @returns {boolean}
     */
    isPath(path) {
        precon.string(path, 'path');

        const _ = this;
        return _._pathSet.has(path);
    }


    $createCommand(definition) {
        return new Command(definition);
    }


    _addPathsAndCategories(path) {
        const _ = this;
        const pathPartsArr = path.split('.');
        if (pathPartsArr.length > 1) {
            const subPathArr = [];
            pathPartsArr.forEach(part => {
                subPathArr.push(part);
                const subPath = subPathArr.join('.');

                _._pathSet.add(subPath);

                if (!_._commandMap.has(subPath))
                    _._commandMap.set(subPath, new Category({ path: subPath }));
            });
        }
        else {
            _._pathSet.add(path);
        }
    }


    static get CLASS_ID() { return '207a2bfa2d86406c87151b14186cc0b2d2cf722539298edfe6328f2a52785a9a'; }
    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfById(obj, Commands.CLASS_ID);
    }
}

module.exports = Commands;