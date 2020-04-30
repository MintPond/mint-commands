'use strict';

const
    assert = require('assert'),
    Commands = require('./../libs/class.Commands'),
    cmdParser = require('./../libs/service.cmdParser');

let commands;

function globalBe() {
    commands = new Commands();
    commands.define({
        path: 'command1',
        params: ['param1', 'param2='],
        options: ['option1', 'option2'],
        flags: ['flag1', 'flag2']
    });
    commands.define({
        path: 'category1.command2',
        params: ['param1', 'param2='],
        options: ['option1', 'option2'],
        flags: ['flag1', 'flag2']
    });
}

describe('cmdParser', () => {

    beforeEach(globalBe);

    it('should parse correct command path (command1)', () => {
        const result = cmdParser.parse(commands, ['command1', 'arg1', '-option2', 'value2', '--flag1']);
        assert.strictEqual(result.path, 'command1');
    });

    it('should parse correct args (command1)', () => {
        const result = cmdParser.parse(commands, ['command1', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.args, ['arg1', '-option2', 'value2', '--flag1']);
    });

    it('should return correct isHelp result (command1)', () => {
        const result = cmdParser.parse(commands, ['command1', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.isHelp, false);
    });

    it('should parse correct command path (category1.command2)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', 'arg1', '-option2', 'value2', '--flag1']);
        assert.strictEqual(result.path, 'category1.command2');
    });

    it('should parse correct args (category1.command2)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.args, ['arg1', '-option2', 'value2', '--flag1']);
    });

    it('should return correct isHelp result (category1.command2)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.isHelp, false);
    });

    it('should return known categories and commands and exclude unregistered command (fakecommand)', () => {
        const result = cmdParser.parse(commands, ['fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
        assert.strictEqual(result.path, '');
    });

    it('should return unregistered command as argument (fakecommand)', () => {
        const result = cmdParser.parse(commands, ['fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.args, ['fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
    });

    it('should return correct isHelp result (fakecommand)', () => {
        const result = cmdParser.parse(commands, ['fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.isHelp, false);
    });

    it('should return known categories and commands and exclude unregistered command (category1.fakecommand)', () => {
        const result = cmdParser.parse(commands, ['category1', 'fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
        assert.strictEqual(result.path, 'category1');
    });

    it('should return unregistered command as argument (category1.fakecommand)', () => {
        const result = cmdParser.parse(commands, ['category1', 'fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.args, ['fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
    });

    it('should return correct isHelp result (category1.fakecommand)', () => {
        const result = cmdParser.parse(commands, ['category1', 'fakecommand', 'arg1', '-option2', 'value2', '--flag1']);
        assert.deepEqual(result.isHelp, false);
    });

    it('should parse correct command path (?)', () => {
        const result = cmdParser.parse(commands, ['?']);
        assert.strictEqual(result.path, '');
    });

    it('should parse correct args (?)', () => {
        const result = cmdParser.parse(commands, ['?']);
        assert.deepEqual(result.args, []);
    });

    it('should return correct isHelp result (?)', () => {
        const result = cmdParser.parse(commands, ['?']);
        assert.deepEqual(result.isHelp, true);
    });

    it('should parse correct command path (command1 ?)', () => {
        const result = cmdParser.parse(commands, ['command1', '?']);
        assert.strictEqual(result.path, 'command1');
    });

    it('should parse correct args (command1 ?)', () => {
        const result = cmdParser.parse(commands, ['command1', '?']);
        assert.deepEqual(result.args, []);
    });

    it('should return correct isHelp result (command1 ?)', () => {
        const result = cmdParser.parse(commands, ['command1', '?']);
        assert.deepEqual(result.isHelp, true);
    });

    it('should parse correct command path (category1.command2 ?)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', '?']);
        assert.strictEqual(result.path, 'category1.command2');
    });

    it('should parse correct args (category1.command2 ?)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', '?']);
        assert.deepEqual(result.args, []);
    });

    it('should return correct isHelp result (category1.command2 ?)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', '?']);
        assert.deepEqual(result.isHelp, true);
    });

    it('should parse correct command path (--help)', () => {
        const result = cmdParser.parse(commands, ['--help']);
        assert.strictEqual(result.path, '');
    });

    it('should parse correct args (--help)', () => {
        const result = cmdParser.parse(commands, ['--help']);
        assert.deepEqual(result.args, []);
    });

    it('should return correct isHelp result (--help)', () => {
        const result = cmdParser.parse(commands, ['--help']);
        assert.deepEqual(result.isHelp, true);
    });

    it('should parse correct command path (command1 --help)', () => {
        const result = cmdParser.parse(commands, ['command1', '--help']);
        assert.strictEqual(result.path, 'command1');
    });

    it('should parse correct args (command1 --help)', () => {
        const result = cmdParser.parse(commands, ['command1', '--help']);
        assert.deepEqual(result.args, []);
    });

    it('should return correct isHelp result (command1 --help)', () => {
        const result = cmdParser.parse(commands, ['command1', '--help']);
        assert.deepEqual(result.isHelp, true);
    });

    it('should parse correct command path (category1.command2 --help)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', '--help']);
        assert.strictEqual(result.path, 'category1.command2');
    });

    it('should parse correct args (category1.command2 --help)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', '--help']);
        assert.deepEqual(result.args, []);
    });

    it('should return correct isHelp result (category1.command2 --help)', () => {
        const result = cmdParser.parse(commands, ['category1', 'command2', '--help']);
        assert.deepEqual(result.isHelp, true);
    });
});