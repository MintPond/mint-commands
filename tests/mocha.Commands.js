'use strict';

const
    assert = require('assert'),
    Category = require('./../libs/class.Category'),
    Command = require('./../libs/class.Command'),
    MCommands = require('./../libs/class.Commands');

let commands;

describe('Commands', () => {

    function globalBe() {
        commands = new MCommands();
    }

    describe('define function', () => {
        beforeEach(globalBe);

        it('should add command path to pathsArr', () => {
            commands.define({ path: 'test' });
            assert.strictEqual(commands.pathsArr[0], 'test');
        });

        it('should add command sub-paths to pathsArr', () => {
            commands.define({ path: 'base.sub.path.test' });
            assert.strictEqual(commands.pathsArr.indexOf('base') !== -1, true);
            assert.strictEqual(commands.pathsArr.indexOf('base.sub') !== -1, true);
            assert.strictEqual(commands.pathsArr.indexOf('base.sub.path') !== -1, true);
            assert.strictEqual(commands.pathsArr.indexOf('base.sub.path.test') !== -1, true);
        });

        it('should return a Command', () => {
            const cmd = commands.define({ path: 'test' });
            assert.strictEqual(cmd instanceof Command, true);
            assert.strictEqual(cmd.path, 'test');
        });

        it('should return a Command with params', () => {
            const cmd = commands.define({ path: 'test', params: ['param1', 'param2='] });
            assert.strictEqual(cmd.paramsArr.length, 2);
            assert.strictEqual(cmd.paramsArr[0].name, 'param1');
            assert.strictEqual(cmd.paramsArr[1].name, 'param2');
        });

        it('should return a Command with options', () => {
            const cmd = commands.define({ path: 'test', options: ['option1', 'option2=a'] });
            assert.strictEqual(cmd.optionsArr.length, 2);
            assert.strictEqual(cmd.optionsArr[0].name, 'option1');
            assert.strictEqual(cmd.optionsArr[1].name, 'option2');
        });

        it('should return a Command with flags', () => {
            const cmd = commands.define({ path: 'test', flags: ['flag1', 'flag2'] });
            assert.strictEqual(cmd.flagsArr.length, 2);
            assert.strictEqual(cmd.flagsArr[0].name, 'flag1');
            assert.strictEqual(cmd.flagsArr[1].name, 'flag2');
        });

        it('should return a Command with description', () => {
            const cmd = commands.define({ path: 'test', description: 'A test command.' });
            assert.strictEqual(cmd.description, 'A test command.');
        });
    });

    describe('get function', () => {

        let cmd;
        beforeEach(globalBe);
        beforeEach(() => {
            cmd = commands.define({
                path: 'this.is.a.test',
                params: ['param1', 'param2='],
                options: ['option1', 'option2'],
                flags: ['flag1', 'flag2']
            });
        });

        it('should get a command by path', () => {
            const cmd2 = commands.get('this.is.a.test');
            assert.strictEqual(cmd2, cmd);
        });

        it('should get a category by path', () => {
            const cmd2 = commands.get('this.is');
            assert.strictEqual(cmd2 instanceof Category, true);
        })
    });

    describe('getAll function', () => {

        let cmd;
        beforeEach(globalBe);
        beforeEach(() => {
            cmd = commands.define({
                path: 'this.is.a.test',
                params: ['param1', 'param2='],
                options: ['option1', 'option2'],
                flags: ['flag1', 'flag2']
            });
        });

        it('should get all commands and categories that match path or descend from path', () => {

            const cmdArr = commands.getAll('this.is');

            assert.strictEqual(cmdArr.length, 3);

            const pathsArr = cmdArr.map(cmd => cmd.path);
            assert.strictEqual(pathsArr.indexOf('this.is') !== -1, true);
            assert.strictEqual(pathsArr.indexOf('this.is.a') !== -1, true);
            assert.strictEqual(pathsArr.indexOf('this.is.a.test') !== -1, true);
        });
    });

    describe('isPath function', () => {

        let cmd;
        beforeEach(globalBe);
        beforeEach(() => {
            cmd = commands.define({
                path: 'this.is.a.test',
                params: ['param1', 'param2='],
                options: ['option1', 'option2'],
                flags: ['flag1', 'flag2']
            });
        });

        it('should return true for valid paths', () => {
            assert.strictEqual(commands.isPath('this.is'), true);
            assert.strictEqual(commands.isPath('this.is.a.test'), true);
        });

        it('should return true for invalid paths', () => {
            assert.strictEqual(commands.isPath('this.isnt'), false);
            assert.strictEqual(commands.isPath('this.issnt.a.test'), false);
        });
    });

    describe('instanceof handling', () => {
        beforeEach(globalBe);

        it('should return true when the instance is exact', () => {
            assert.strictEqual(commands instanceof MCommands, true);
        });

        it('should return false when the instance is NOT exact', () => {

            class NotCommands {}
            const not = new NotCommands();

            assert.strictEqual(not instanceof MCommands, false);
        });

        it('should return true when the instance extends the valid class', () => {

            class ExtendedCommands extends MCommands {}
            const extended = new ExtendedCommands();

            assert.strictEqual(extended instanceof MCommands, true);
        });

        it('should return true if the instance meets all of the API criteria', () => {

            class Commands {
                define() {}
                get() {}
                getAll() {}
                isPath() {}
                get pathsArr() {}
            }

            const substitute = new Commands();

            assert.strictEqual(substitute instanceof MCommands, true);
        });
    });
});