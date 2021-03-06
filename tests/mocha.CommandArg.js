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

        it('should have correct toJSON return value', () => {
            const jsonObj = cmdArg.toJSON();
            assert.strictEqual(jsonObj.name, 'param1');
            assert.strictEqual(jsonObj.value, 'value1');
            assert.strictEqual(jsonObj.isDefaultValue, false);
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

        it('should have correct toJSON return value', () => {
            const jsonObj = cmdArg.toJSON();
            assert.strictEqual(jsonObj.name, 'param1');
            assert.strictEqual(jsonObj.value, '');
            assert.strictEqual(jsonObj.isDefaultValue, true);
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

        it('should have correct toJSON return value', () => {
            const jsonObj = cmdArg.toJSON();
            assert.strictEqual(jsonObj.name, 'param1');
            assert.strictEqual(jsonObj.value, 'value1');
            assert.strictEqual(jsonObj.isDefaultValue, false);
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

        it('should have correct toJSON return value', () => {
            const jsonObj = cmdArg.toJSON();
            assert.strictEqual(jsonObj.name, 'param1');
            assert.strictEqual(jsonObj.value, 'abc');
            assert.strictEqual(jsonObj.isDefaultValue, true);
        });
    });
});

