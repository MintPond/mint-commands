'use strict';

const
    precon = require('@mintpond/mint-precon'),
    pu = require('@mintpond/mint-utils').prototypes,
    Command = require('./class.Command');


/**
 * A command definition to use where an actual command is not defined (i.e. categories).
 */
class Category extends Command {

    /**
     * Constructor.
     *
     * @param args
     * @param args.path {string}
     * @param [args.description] {string}
     */
    constructor(args) {
        precon.string(args.path, 'path');
        precon.opt_string(args.description, 'description');

        super(args);
    }


    /* Override */
    execute(argMap, callback) {
        throw new Error('Cannot execute a category.');
    }

    /* Override */
    toJSON() {
        const _ = this;
        return {
            path: _.path,
            description: _.description
        };
    }


    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfByName(obj, 'Category') &&
            obj instanceof Command;
    }
}

module.exports = Category;