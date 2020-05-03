'use strict';

const
    assert = require('assert'),
    MCommandParameter = require('./../libs/class.CommandParameter');

let parameter;

describe('CommandParameter', () => {

    context('string parameter, no default', () => {

        beforeEach(() => { parameter = new MCommandParameter('param1'); })

        it('should be named "param1"', () => {
            assert.strictEqual(parameter.name, 'param1');
        });

        it('should not have a default value', () => {
            assert.strictEqual(parameter.hasDefaultValue, false);
            assert.strictEqual(parameter.defaultValue, '');
        });

        it('should not have a description', () => {
            assert.strictEqual(parameter.description, '')
        });
    });

    context('string parameter, with default', () => {

        beforeEach(() => { parameter = new MCommandParameter('param1=dv'); })

        it('should be named "param1"', () => {
            assert.strictEqual(parameter.name, 'param1');
        });

        it('should have a default value', () => {
            assert.strictEqual(parameter.hasDefaultValue, true);
            assert.strictEqual(parameter.defaultValue, 'dv');
        });

        it('should not have a description', () => {
            assert.strictEqual(parameter.description, '')
        });
    });

    context('object parameter', () => {

        beforeEach(() => {
            parameter = new MCommandParameter({
                name: 'param1',
                defaultValue: 'dv',
                description: 'this is a description'
            });
        })

        it('should be named "param1"', () => {
            assert.strictEqual(parameter.name, 'param1');
        });

        it('should have a default value', () => {
            assert.strictEqual(parameter.hasDefaultValue, true);
            assert.strictEqual(parameter.defaultValue, 'dv');
        });

        it('should have a description', () => {
            assert.strictEqual(parameter.description, 'this is a description')
        });
    });

    context('object parameter w/ extra properties', () => {

        beforeEach(() => {
            parameter = new MCommandParameter({
                name: 'param1',
                defaultValue: 'dv',
                description: 'this is a description',
                extra1: 'extra value'
            });
        })

        it('should be named "param1"', () => {
            assert.strictEqual(parameter.name, 'param1');
        });

        it('should have a default value', () => {
            assert.strictEqual(parameter.hasDefaultValue, true);
            assert.strictEqual(parameter.defaultValue, 'dv');
        });

        it('should have a description', () => {
            assert.strictEqual(parameter.description, 'this is a description')
        });

        it('should have extra property', () => {
            assert.strictEqual(parameter.extra1, 'extra value');
        })
    });
});
