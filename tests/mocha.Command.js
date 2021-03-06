'use strict';

const
    assert = require('assert'),
    MCommand = require('./../libs/class.Command'),
    CommandParameter = require('./../libs/class.CommandParameter');

let cmd;

function globalBe() {
    cmd = new MCommand({
        path: 'category.command',
        params: [
            {name: 'param1', description: '1st parameter'},
            'param2='
        ],
        options: ['option1=defVal', 'option2'],
        flags: ['flag1', {name: 'flag2'}],
        description: 'command description'
    });
}


describe('Command', () => {

    beforeEach(globalBe);

    it('should have correct path', () => {
        assert.strictEqual(cmd.path, 'category.command');
    });

    it('should return CommandParameter instances from paramsArr property', () => {
        cmd.paramsArr.forEach(param => {
            assert.strictEqual(param instanceof CommandParameter, true);
        })
    });

    it('should return CommandParameter instances from optionsArr property', () => {
        cmd.optionsArr.forEach(param => {
            assert.strictEqual(param instanceof CommandParameter, true);
        })
    });

    it('should return CommandParameter instances from flagsArr property', () => {
        cmd.flagsArr.forEach(param => {
            assert.strictEqual(param instanceof CommandParameter, true);
        })
    });

    it('should have param1 parameter', () => {
        assert.strictEqual(cmd.paramsArr[0].name, 'param1');
    });

    it('should have param2 parameter', () => {
        assert.strictEqual(cmd.paramsArr[1].name, 'param2');
    });

    it('should have option1 option', () => {
        assert.strictEqual(cmd.optionsArr[0].name, 'option1');
    });

    it('should have option2 option', () => {
        assert.strictEqual(cmd.optionsArr[1].name, 'option2');
    });

    it('should have flag1 flag', () => {
        assert.strictEqual(cmd.flagsArr[0].name, 'flag1');
    });

    it('should have flag2 flag', () => {
        assert.strictEqual(cmd.flagsArr[1].name, 'flag2');
    });

    it('should have correct description', () => {
        assert.strictEqual(cmd.description, 'command description');
    });

    it('should have correct toJSON return value', () => {
        const jsonObj = cmd.toJSON();
        assert.strictEqual(jsonObj.path, 'category.command');

        assert.strictEqual(Array.isArray(jsonObj.params), true);
        assert.strictEqual(jsonObj.params.length, 2);
        assert.strictEqual(jsonObj.params[0].name, 'param1');
        assert.strictEqual(jsonObj.params[1].name, 'param2');

        assert.strictEqual(Array.isArray(jsonObj.options), true);
        assert.strictEqual(jsonObj.options.length, 2);
        assert.strictEqual(jsonObj.options[0].name, 'option1');
        assert.strictEqual(jsonObj.options[1].name, 'option2');

        assert.strictEqual(Array.isArray(jsonObj.flags), true);
        assert.strictEqual(jsonObj.flags.length, 2);
        assert.strictEqual(jsonObj.flags[0].name, 'flag1');
        assert.strictEqual(jsonObj.flags[1].name, 'flag2');

        assert.deepEqual(jsonObj.extra, cmd.extra);
        assert.strictEqual(jsonObj.usage, cmd.usage);
        assert.strictEqual(jsonObj.description, cmd.description);
    });
});