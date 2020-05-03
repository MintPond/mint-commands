'use strict';

const
    assert = require('assert'),
    Command = require('./../libs/class.Command'),
    CommandArg = require('./../libs/class.CommandArg'),
    MCommandArgs = require('./../libs/class.CommandArgs'),
    argParser = require('./../libs/service.argParser');

let cmd;
let paramArg;
let optionArg;
let flagArg;
let args;

function globalBe() {

    cmd = new Command({
        path: 'command1',
        params: ['param1'],
        options: ['option1'],
        flags: ['flag1']
    });

    paramArg = new CommandArg(cmd.paramsArr[0], 'value1');
    optionArg = new CommandArg(cmd.optionsArr[0], 'value2');
    flagArg = new CommandArg(cmd.flagsArr[0], true);

    args = argParser.parse(cmd, ['value1', '-option1', 'value2', '--flag1']);
}

describe('CommandArgs', () => {

    beforeEach(globalBe);

    it('should have correct params parameters', () => {
        assert.strictEqual(args.paramsArr[0].name, 'param1');
    });

    it('should have correct options parameters', () => {
        assert.strictEqual(args.optionsOMap['option1'].name, 'option1');
    });

    it('should have correct flag parameters', () => {
        assert.strictEqual(args.flagsOMap['flag1'].name, 'flag1');
    });

    it('should have correct values in values object map', () => {
        assert.strictEqual(args.argsOMap['param1'], 'value1');
        assert.strictEqual(args.argsOMap['option1'], 'value2');
        assert.strictEqual(args.argsOMap['flag1'], true);
    });

    describe('instanceof handling', () => {
        beforeEach(globalBe);

        it('should return true when the instance is exact', () => {
            assert.strictEqual(args instanceof MCommandArgs, true);
        });

        it('should return false when the instance is NOT exact', () => {

            class NotCommandArgs {}
            const not = new NotCommandArgs();

            assert.strictEqual(not instanceof MCommandArgs, false);
        });

        it('should return true when the instance extends the valid class', () => {

            class ExtendedCommandArgs extends MCommandArgs {}
            const extended = new ExtendedCommandArgs(cmd);

            assert.strictEqual(extended instanceof MCommandArgs, true);
        });

        it('should return true if the instance meets all of the API criteria', () => {

            class CommandArgs {
                get paramsArr() {}
                get optionsOMap() {}
                get flagsOMap() {}
                get argsOMap() {}
            }

            const substitute = new CommandArgs();

            assert.strictEqual(substitute instanceof MCommandArgs, true);
        });
    });
});