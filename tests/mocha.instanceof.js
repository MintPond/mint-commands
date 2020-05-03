'use strict';

const
    assert = require('assert'),
    index = require('./../index');


describe('instanceof checks', () => {

    const idMap = new Map();

    Object.keys(index).forEach(memberName => {

        const Member = index[memberName];

        if (!Member.CLASS_ID)
            return; // continue;

        describe(`${Member.name}`, () => {

            it ('should not have a duplicate CLASS_ID', () => {

                if (idMap.has(Member.CLASS_ID))
                    throw new Error(`Duplicate CLASS_ID: ${idMap.get(Member.CLASS_ID)}`);

                idMap.set(Member.CLASS_ID, Member.name);
            });

            it('should return true when the instance is exact', () => {
                const instance = Member.TEST_INSTANCE ? Member.TEST_INSTANCE(Member) : new Member();
                assert.strictEqual(instance instanceof Member, true);
                Member.TEST_DESTROY && Member.TEST_DESTROY(instance);
            });

            it('should return false when the instance is NOT exact', () => {

                class NotMember {}
                const not = new NotMember();

                assert.strictEqual(not instanceof Member, false);
            });

            it('should return true when the instance extends the valid class', () => {

                class ExtendedMember extends Member {}
                const extended = Member.TEST_INSTANCE ? Member.TEST_INSTANCE(ExtendedMember) : new ExtendedMember();

                assert.strictEqual(extended instanceof Member, true);

                Member.TEST_DESTROY && Member.TEST_DESTROY(extended);
            });

            it('should return true if the instance meets all of the API criteria', () => {

                class Substitute {
                    static get CLASS_ID() { return Member.CLASS_ID }
                }

                const substitute = new Substitute();

                assert.strictEqual(substitute instanceof Member, true);
            });
        });
    });
});
