'use strict';

const
    assert = require('assert'),
    Command = require('./../libs/class.Category'),
    argParser = require('./../libs/service.argParser');

let cmd1;

function globalBe() {
    cmd1 = new Command({
        path: 'cat1.cat2.command',
        params: ['param1', 'param2=7'],
        options: ['option1', 'option2', 'option3=hello'],
        flags: ['flag1', 'flag2'],
        description: 'This is a command',
        execute: (args, done) => {
        }
    });
}

describe('argParser', () => {

    context('parameters', () => {
        beforeEach(globalBe);

        it ('should correctly parse parameters (1)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '-option1', 'value1', '--flag2']);
            assert.strictEqual(cmdArgs.paramsArr[0].name, 'param1');
            assert.strictEqual(cmdArgs.paramsArr[0].isDefaultValue, false);
            assert.strictEqual(cmdArgs.paramsArr[0].value, 'arg1');
        });

        it ('should correctly parse parameters (2)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '--flag1', '-option1', 'value1']);
            assert.strictEqual(cmdArgs.paramsArr[1].name, 'param2');
            assert.strictEqual(cmdArgs.paramsArr[1].isDefaultValue, false);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'arg2');
        });

        it ('should fill in default values', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1']);
            assert.strictEqual(cmdArgs.paramsArr[1].name, 'param2');
            assert.strictEqual(cmdArgs.paramsArr[1].isDefaultValue, true);
            assert.strictEqual(cmdArgs.paramsArr[1].value, '7');
        });
    });

    context('options', () => {
        beforeEach(globalBe);

        it('should correctly parse options (1)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '-option1', 'value1', '--flag2']);
            assert.strictEqual(cmdArgs.optionsOMap['option1'].value, 'value1');
            assert.strictEqual(cmdArgs.optionsOMap['option2'].value, '');
        });

        it('should correctly parse options (2)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '--flag1', '-option2', 'value2']);
            assert.strictEqual(cmdArgs.optionsOMap['option2'].value, 'value2');
            assert.strictEqual(cmdArgs.optionsOMap['option1'].value, '');
        });

        it('should correctly parse options (3)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '--flag1', '-option2', 'value2', '-option1', 'value1']);
            assert.strictEqual(cmdArgs.optionsOMap['option2'].value, 'value2');
            assert.strictEqual(cmdArgs.optionsOMap['option1'].value, 'value1');
        });

        it('should correctly add default value when option is not specified', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1']);
            assert.strictEqual(cmdArgs.optionsOMap['option3'].value, 'hello');
        });

        it('should correctly override default value when options is specified', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '-option3', 'goodbye']);
            assert.strictEqual(cmdArgs.optionsOMap['option3'].value, 'goodbye');
        });
    });

    context('flags', () => {
        beforeEach(globalBe);

        it('should correctly parse flags (1)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '-option1', 'value1', '--flag2']);
            assert.strictEqual(cmdArgs.flagsOMap['flag1'].value, false);
            assert.strictEqual(cmdArgs.flagsOMap['flag2'].value, true);
        });

        it('should correctly parse flags (2)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '--flag1', '-option1', 'value1']);
            assert.strictEqual(cmdArgs.flagsOMap['flag1'].value, true);
            assert.strictEqual(cmdArgs.flagsOMap['flag2'].value, false);
        });

        it('should correctly parse flags (3)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '-option1', 'value1']);
            assert.strictEqual(cmdArgs.flagsOMap['flag1'].value, false);
            assert.strictEqual(cmdArgs.flagsOMap['flag2'].value, false);
        });

        it('should correctly parse flags (4)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '--flag2']);
            assert.strictEqual(cmdArgs.flagsOMap['flag1'].value, false);
            assert.strictEqual(cmdArgs.flagsOMap['flag2'].value, true);
        });

        it('should correctly parse flags (5)', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'arg2', '--flag2', '--flag1']);
            assert.strictEqual(cmdArgs.flagsOMap['flag1'].value, true);
            assert.strictEqual(cmdArgs.flagsOMap['flag2'].value, true);
        });
    });

    context('quoted values', ()=> {
        beforeEach(globalBe);

        it('should keep double quoted text in the same value', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '"this', 'is', 'quoted"']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'this is quoted');
        });

        it('should keep single quoted text in the same value', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '\'this', 'is', 'quoted\'']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'this is quoted');
        });

        it('should keep tilde quoted text in the same value', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '`this', 'is', 'quoted`']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'this is quoted');
        });

        it('should ignore single quotes while in a double quote', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '"this', '\'is\'', 'quoted"']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, `this 'is' quoted`);
        });

        it('should ignore tilde quotes while in a double quote', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '"this', '`is`', 'quoted"']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'this `is` quoted');
        });

        it('should ignore double quotes while in a single quote', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '\'this', '"is"', 'quoted\'']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, `this "is" quoted`);
        });

        it('should ignore tilde quotes while in a single quote', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '\'this', '`is`', 'quoted\'']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'this `is` quoted');
        });

        it('should ignore double quotes while in a tilde quote', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '`this', '"is"', 'quoted`']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'this "is" quoted');
        });

        it('should ignore single quotes while in a tilde quote', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '`this', '\'is\'', 'quoted`']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, `this 'is' quoted`);
        });

        it('should ignore single quotes that do not start the value', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', `john's`]);
            assert.strictEqual(cmdArgs.paramsArr[1].value, `john's`);
        });

        it('should ignore tilde quotes that do not start the value', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', 'john`s']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, 'john`s');
        });

        it('should ignore double quotes that do not start the value', () => {
            const cmdArgs = argParser.parse(cmd1, ['arg1', '`"john"`']);
            assert.strictEqual(cmdArgs.paramsArr[1].value, '"john"');
        });
    });
});