'use strict';

const pu = require('@mintpond/mint-utils').prototypes;


class CommandError extends Error{

    /**
     * Constructor.
     *
     * @param description {string} A description of the error.
     * @param [data] {*} Optional data to attach to the error.
     */
    constructor(description, data) {
        super(description);

        this.isCommandError = true;
        this.data = data || {};
    }


    static get CLASS_ID() { return '0eb4a3266982cf15599b0ec2496096d2c7f32ce2cc9a8d8670c6a773c56d182b'; }
    static TEST_INSTANCE(CommandError) {
        return new CommandError('test');
    }
    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfById(obj, CommandError.CLASS_ID);
    }
}

module.exports = CommandError;