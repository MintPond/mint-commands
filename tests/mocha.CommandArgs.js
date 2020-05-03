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
});