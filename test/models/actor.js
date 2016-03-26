'use strict';
const Joi = require('joi');
const Extend = require('extend');
const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const ActorSchema = require('../../models/actor');

describe('Actor Model Tests', () => {
    describe('Mbox', () => {
        //TODO: Add the other permutations for mbox_sha1sum, openid, and account
        it('should validate an actor with an mbox only', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org'
            };
            expect(Joi.attempt(actor, ActorSchema)).to.deep.equal(Extend(actor, { objectType: 'Agent' }));
            done();
        });

        it('should validate an actor with an mbox and name', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org',
                name: 'Malcom Reynolds'
            };
            expect(Joi.attempt(actor, ActorSchema)).to.deep.equal(Extend(actor, { objectType: 'Agent' }));
            done();
        });

        it('should validate an actor with an mbox, name, and objectType', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org',
                name: 'Malcolm Reynolds',
                objectType: 'Agent'
            };
            expect(Joi.attempt(actor, ActorSchema)).to.deep.equal(actor);
            done();
        });

        it('shouldn\'t validate an actor with an invalid mbox without an objectType', (done) => {
            const actor = {
                mbox: 'mal@serenity.org'
            };
            expect(() => {
                Joi.attempt(actor, ActorSchema);
            }).to.throw(Error, /"mbox" must be a valid uri with a scheme matching the mailto pattern/);
            done();
        });

        it('shouldn\'t validate an actor with an invalid mbox with an objectType', (done) => {
            const actor = {
                mbox: 'mal@serenity.org',
                objectType: 'Agent'
            };
            expect(() => {
                Joi.attempt(actor, ActorSchema);
            }).to.throw(Error, /"mbox" must be a valid uri with a scheme matching the mailto pattern/);
            done();
        });
    });

    describe('Conformance Details', () => {
        // See: https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md#details-1
        it('An Agent MUST be identified by one (1) of the four types of Inverse Functional Identifiers', (done) => {
            const actor = {
                name: 'Malcolm Reynolds',
                objectType: 'Agent'
            };
            expect(() => {

                Joi.attempt(actor, ActorSchema);
            }).to.throw(Error, /"value" must contain at least one of \[mbox, mbox_sha1sum, openid, account]/);
            done();
        });
        describe('An Agent MUST NOT include more than one (1) Inverse Functional Identifier', () => {
            //TODO: Add the rest of the combinations here for completeness.
            it('shouldn\'t validate an mbox and mbox_sha1sum', (done) => {
                const actor = {
                    mbox: 'mailto:mal@serenity.org',
                    mbox_sha1sum: 'ebd31e95054c018b10727ccffd2ef2ec3a016ee9'
                };
                expect(() => {

                    Joi.attempt(actor, ActorSchema);
                }).to.throw(Error, /"value" contains a conflict between exclusive peers \[mbox, mbox_sha1sum, openid, account]/);
                done();
            });
            it('shouldn\'t validate an mbox and openid', (done) => {
                const actor = {
                    mbox: 'mailto:mal@serenity.org',
                    openid: 'https://serenity.org/openid/mal'
                };
                expect(() => {
                    Joi.attempt(actor, ActorSchema);
                }).to.throw(Error, /"value" contains a conflict between exclusive peers \[mbox, mbox_sha1sum, openid, account]/);
                done();
            });
        });
        describe('An Agent SHOULD NOT use Inverse Functional Identifiers that are also used as a Group identifier', () => {
            //TODO: Need to add a programatic check for this as it can't be handled in Joi.
            it.skip('shouldn\'t be able to have an identified group with a matching member by functional identifier', (done) => {
                const actor = {
                    objectType: 'Group',
                    mbox: 'mailto:crew@serenity.org',
                    member: [
                        {
                            name: 'Crew',
                            mbox: 'mailto:crew@serenity.org'
                        }
                    ]
                };
                expect(() => {
                    Joi.attempt(actor, ActorSchema);
                }).to.throw(Error, /asdasdasd/);
                done();
            });
        });
    });
});
