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


    static [Symbol.hasInstance](obj) {
        return pu.isInstanceOfByName(obj, 'CommandError') &&
            obj instanceof Error;
    }
}

module.exports = CommandError;