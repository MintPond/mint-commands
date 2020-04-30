'use strict';

const
    assert = require('assert'),
    MCommandArg = require('./../libs/class.CommandArg'),
    CommandParameter = require('./../libs/class.CommandParameter');

let cmdParam;
let cmdArg;


describe('CommandArg', () => {

    context('with value, no default specified', () => {
        beforeEach(() => {
            cmdParam = new CommandParameter('param1');
            cmdArg = new MCommandArg(cmdParam, 'value1');
        });

        it('should have correct parameter name', () => {
            assert.strictEqual(cmdArg.name, 'param1');
        });

        it('should have correct parameter', () => {
            assert.strictEqual(cmdArg.parameter, cmdParam);
        });

        it('should have correct value', () => {
            assert.strictEqual(cmdArg.value, 'value1');
        });

        it('should return correct value from isDefaultValue', () => {
            assert.strictEqual(cmdArg.isDefaultValue, false);
        });
    });

    context('no value, no default specified', () => {
        beforeEach(() => {
            cmdParam = new CommandParameter('param1');
            cmdArg = new MCommandArg(cmdParam, '');
        });

        it('should have correct parameter name', () => {
            assert.strictEqual(cmdArg.name, 'param1');
        });

        it('should have correct parameter', () => {
            assert.strictEqual(cmdArg.parameter, cmdParam);
        });

        it('should have correct value', () => {
            assert.strictEqual(cmdArg.value, '');
        });

        it('should return correct value from isDefaultValue', () => {
            assert.strictEqual(cmdArg.isDefaultValue, true);
        });
    });

    context('with value, with default specified', () => {
        beforeEach(() => {
            cmdParam = new CommandParameter('param1=abc');
            cmdArg = new MCommandArg(cmdParam, 'value1');
        });

        it('should have correct parameter name', () => {
            assert.strictEqual(cmdArg.name, 'param1');
        });

        it('should have correct parameter', () => {
            assert.strictEqual(cmdArg.parameter, cmdParam);
        });

        it('should have correct value', () => {
            assert.strictEqual(cmdArg.value, 'value1');
        });

        it('should return correct value from isDefaultValue', () => {
            assert.strictEqual(cmdArg.isDefaultValue, false);
        });
    });

    context('no value, with default specified', () => {
        beforeEach(() => {
            cmdParam = new CommandParameter('param1=abc');
            cmdArg = new MCommandArg(cmdParam, '');
        });

        it('should have correct parameter name', () => {
            assert.strictEqual(cmdArg.name, 'param1');
        });

        it('should have correct parameter', () => {
            assert.strictEqual(cmdArg.parameter, cmdParam);
        });

        it('should have correct value', () => {
            assert.strictEqual(cmdArg.value, 'abc');
        });

        it('should return correct value from isDefaultValue', () => {
            assert.strictEqual(cmdArg.isDefaultValue, true);
        });
    });

    describe('instanceof handling', () => {
        beforeEach(() => {
            cmdParam = new CommandParameter('param1=abc');
            cmdArg = new MCommandArg(cmdParam, '');
        });

        it('should return true when the instance is exact', () => {
            assert.strictEqual(cmdArg instanceof MCommandArg, true);
        });

        it('should return false when the instance is NOT exact', () => {

            class NotCommandArg {}
            const not = new NotCommandArg();

            assert.strictEqual(not instanceof MCommandArg, false);
        });

        it('should return true when the instance extends the valid class', () => {

            class ExtendedCommandArg extends MCommandArg {}
            const extended = new ExtendedCommandArg(cmdParam, '');

            assert.strictEqual(extended instanceof MCommandArg, true);
        });

        it('should return true if the instance meets all of the API criteria', () => {

            class CommandArg {
                get name() {}
                get parameter() {}
                get value() {}
                get isDefaultValue() {}
            }

            const substitute = new CommandArg();

            assert.strictEqual(substitute instanceof MCommandArg, true);
        });
    });
});

