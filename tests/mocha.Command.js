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

    describe('instanceof handling', () => {
        beforeEach(globalBe);

        it('should return true when the instance is exact', () => {
            assert.strictEqual(cmd instanceof MCommand, true);
        });

        it('should return false when the instance is NOT exact', () => {

            class NotAdaptiveConfig {}
            const not = new NotAdaptiveConfig();

            assert.strictEqual(not instanceof MCommand, false);
        });

        it('should return true when the instance extends the valid class', () => {

            class ExtendedCommand extends MCommand {}
            const extended = new ExtendedCommand({ path: 'command1' });

            assert.strictEqual(extended instanceof MCommand, true);
        });

        it('should return true if the instance meets all of the API criteria', () => {

            class Command {
                execute() {}
                get path() {}
                get paramsArr() {}
                get optionsArr() {}
                get flagsArr() {}
                get description() {}
                get usage() {}
                get verboseUsage() {}
                get extra() {}
            }

            const substitute = new Command();

            assert.strictEqual(substitute instanceof MCommand, true);
        });
    });
});