'use strict';

const
    assert = require('assert'),
    CommandError = require('./../libs/class.CommandError'),
    MCommandDispatcher = require('./../libs/class.CommandDispatcher');

let dispatcher;


describe('CommandDispatcher', () => {

    describe('parseQuery function', () => {
        beforeEach(() => {
            dispatcher = new MCommandDispatcher();
            dispatcher.addCommand({
                path: 'category1.command1',
                params: ['param1'],
                options: ['option1'],
                flags: ['flag1'],
            });
        });

        it('should correctly parse query (1)', () => {
            const result = dispatcher.parseQuery('category1 command1 value1');
            assert.strictEqual(result.path, 'category1.command1');
            assert.strictEqual(result.argsOMap['param1'], 'value1');
            assert.strictEqual(result.argsOMap['option1'], '');
            assert.strictEqual(result.argsOMap['flag1'], false);
            assert.strictEqual(result.isHelp, false);
        });

        it('should correctly parse query (2)', () => {
            const result = dispatcher.parseQuery('category1 command1 value1 -option1 value2');
            assert.strictEqual(result.path, 'category1.command1');
            assert.strictEqual(result.argsOMap['param1'], 'value1');
            assert.strictEqual(result.argsOMap['option1'], 'value2');
            assert.strictEqual(result.argsOMap['flag1'], false);
            assert.strictEqual(result.isHelp, false);
        });

        it('should correctly parse query (3)', () => {
            const result = dispatcher.parseQuery('category1 command1 value1 -option1 value2 --flag1');
            assert.strictEqual(result.path, 'category1.command1');
            assert.strictEqual(result.argsOMap['param1'], 'value1');
            assert.strictEqual(result.argsOMap['option1'], 'value2');
            assert.strictEqual(result.argsOMap['flag1'], true);
            assert.strictEqual(result.isHelp, false);
        });

        it('should correctly parse query (4)', () => {
            const result = dispatcher.parseQuery('category1 command1 value1 --flag1');
            assert.strictEqual(result.path, 'category1.command1');
            assert.strictEqual(result.argsOMap['param1'], 'value1');
            assert.strictEqual(result.argsOMap['option1'], '');
            assert.strictEqual(result.argsOMap['flag1'], true);
            assert.strictEqual(result.isHelp, false);
        });

        it('should return false if command not found', () => {
            const result = dispatcher.parseQuery('fakecommand value1 --flag1');
            assert.strictEqual(result, false);
        });

        it('should throw if command is a category', () => {
            const result = dispatcher.parseQuery('category1');
            assert.strictEqual(result.path, 'category1');
            assert.deepEqual(result.argsOMap, {});
            assert.strictEqual(result.isHelp, true);
        });

        it('should return help flag if command help arg is included (?)', () => {
            const result = dispatcher.parseQuery('category1 command1 ?');
            assert.strictEqual(result.path, 'category1.command1');
            assert.deepEqual(result.argsOMap, {});
            assert.strictEqual(result.isHelp, true);
        });

        it('should return help flag if command help arg is included (--help)', () => {
            const result = dispatcher.parseQuery('category1 command1 --help');
            assert.strictEqual(result.path, 'category1.command1');
            assert.deepEqual(result.argsOMap, {});
            assert.strictEqual(result.isHelp, true);
        });

        it('should throw CommandError if required argument is missing', () => {
            try {
                dispatcher.parseQuery('category1 command1');
            }
            catch (err) {
                assert.strictEqual(err instanceof CommandError, true);
                return;
            }
            throw new Error('Exception expected');
        });
    });

    describe('execute function', () => {
        beforeEach(() => {
            dispatcher = new MCommandDispatcher();
        });

        it('should execute a valid command', itDone => {
            dispatcher.addCommand({
                path: 'category1.command1',
                params: ['param1'],
                options: ['option1'],
                flags: ['flag1'],
                execute: (args, done) => {
                    assert.strictEqual(args.param1, 'value1');
                    assert.strictEqual(args.option1, 'value2');
                    assert.strictEqual(args.flag1, true);
                    done('this is error', 'this is result');
                }
            });
            dispatcher.execute('category1.command1', {
                param1: 'value1',
                option1: 'value2',
                flag1: true
            }, (err, result) => {
                assert.strictEqual(err, 'this is error');
                assert.strictEqual(result, 'this is result');
                itDone();
            });
        });

        it('should return error if command not found', itDone => {
            dispatcher.addCommand({
                path: 'category1.command1',
                params: ['param1'],
                options: ['option1'],
                flags: ['flag1'],
                execute: () => {
                    throw new Error('should not execute');
                }
            });
            dispatcher.execute('category1.command2', {
                param1: 'value1'
            }, (err, result) => {
                assert.strictEqual(!!err, true);
                assert.strictEqual(!!result, false);
                itDone();
            });
        });

        it('should return error if command is a category', itDone => {
            dispatcher.addCommand({
                path: 'category1.command1',
                params: ['param1'],
                options: ['option1'],
                flags: ['flag1'],
                execute: () => {
                    throw new Error('should not execute');
                }
            });
            dispatcher.execute('category1', {
                param1: 'value1'
            }, (err, result) => {
                assert.strictEqual(!!err, true);
                assert.strictEqual(!!result, false);
                itDone();
            });
        })
    });
});