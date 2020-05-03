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


    static get CLASS_ID() { return '82321b608cd4904118a208dfb57e8ba4c5b8b70a8663deb07bfe3b71ee4f24b7'; }
    static TEST_INSTANCE(Category) { return new Category({ path: 'test' }); }
    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfById(obj, Category.CLASS_ID);
    }
}

module.exports = Category;