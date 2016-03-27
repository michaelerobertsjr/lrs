'use strict';
const Extend = require('extend');
const Code = require('code');
const Lab = require('lab');
const Crypto = require('crypto');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const Actor = require('../../models/actor').Actor;
const Agent = require('../../models/agent').Agent;
const Group = require('../../models/group').Group;

describe('Actor Model Tests', () => {
    describe('Mbox', () => {
        //TODO: Add the other permutations for mbox_sha1sum, openid, and account
        it('should handle not being called with `new` keyword', (done) => {
            expect(Actor({
                mbox: 'mailto:mal@serenity.org'
            })).to.be.an.instanceof(Agent);

            expect(Actor({
                objectType: 'Group',
                mbox: 'mailto:crew@serenity.org'
            })).to.be.an.instanceof(Group);
            done();
        });
        it('should validate an actor with an mbox only', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org'
            };
            expect(new Actor(actor)).to.deep.equal(new Actor(Extend(actor, { objectType: 'Agent' })));
            done();
        });

        it('should validate an actor with an mbox and name', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org',
                name: 'Malcom Reynolds'
            };
            expect(new Actor(actor)).to.deep.equal(new Actor(Extend(actor, { objectType: 'Agent' })));
            done();
        });

        it('should validate an actor with an mbox, name, and objectType', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org',
                name: 'Malcolm Reynolds',
                objectType: 'Agent'
            };
            expect(new Actor(actor)).to.deep.equal(new Actor(actor));
            done();
        });

        it('should be able to get the inverse identifier', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org',
                objectType: 'Agent'
            };
            expect(new Actor(actor).getIdentifier()).to.deep.equal('mailto:mal@serenity.org');
            const group = {
                mbox: 'mailto:crew@serenity.org',
                objectType: 'Group'
            };
            expect(new Actor(group).getIdentifier()).to.deep.equal('mailto:crew@serenity.org');
            done();
        });

        it('shouldn\'t validate an actor with an invalid mbox without an objectType', (done) => {
            const actor = {
                mbox: 'mal@serenity.org'
            };
            expect(() => {
                return new Actor(actor);
            }).to.throw(Error, /"mbox" must be a valid uri with a scheme matching the mailto pattern/);
            done();
        });
        it('shouldn\'t validate an actor with an invalid mbox with an objectType', (done) => {
            const actor = {
                mbox: 'mal@serenity.org',
                objectType: 'Agent'
            };
            expect(() => {
                return new Actor(actor);
            }).to.throw(Error, /"mbox" must be a valid uri with a scheme matching the mailto pattern/);
            done();
        });
        it('shouldn\'t be able to provide unknown keys', (done) => {
            const actor = {
                mbox: 'mailto:mal@serenity.org',
                objectType: 'Agent',
                motto: 'Curse your sudden, but inevitable betrayal'
            };
            expect(() => {
                return new Actor(actor);
            }).to.throw(Error, /"motto" is not allowed/);
            const group = {
                mbox: 'mailto:crew@serenity.org',
                objectType: 'Group',
                motto: 'Curse your sudden, but inevitable betrayal'
            };
            expect(() => {
                return new Actor(group);
            }).to.throw(Error, /"motto" is not allowed/);
            done();
        });
    });

    describe('Account', () => {
        it('shouldn\'t be able to provide unknown keys', (done) => {
            const actor = {
                account: {
                    homePage: 'http://serenity.org',
                    name: 'malcolm.reynolds69',
                    motto: 'Curse your sudden, but inevitable betrayal'
                },
                objectType: 'Agent'
            };
            expect(() => {
                return new Actor(actor);
            }).to.throw(Error, /"motto" is not allowed/);
            const group = {
                account: {
                    homePage: 'http://serenity.org',
                    name: 'malcolm.reynolds69',
                    motto: 'Curse your sudden, but inevitable betrayal'
                },
                objectType: 'Group'
            };
            expect(() => {
                return new Actor(group);
            }).to.throw(Error, /"motto" is not allowed/);
            done();
        });

        it('should be able to get the inverse identifier', (done) => {
            const actor = {
                account: {
                    homePage: 'http://serenity.org',
                    name: 'malcolm.reynolds69'
                },
                objectType: 'Agent'
            };
            expect(new Actor(actor).getIdentifier()).to.deep.equal(actor.account);
            const group = {
                account: {
                    homePage: 'http://serenity.org',
                    name: 'crew'
                },
                objectType: 'Group'
            };
            expect(new Actor(group).getIdentifier()).to.deep.equal(group.account);
            done();
        });
    });

    describe('MboxSha1Sum', () => {
        it('should be able to get the inverse identifier', (done) => {
            const actorHash = Crypto.createHash('sha1');
            actorHash.update('mailto:mal@serenity.org');
            const actor = {
                mbox_sha1sum: actorHash.digest('base64'),
                objectType: 'Agent'
            };
            expect(new Actor(actor).getIdentifier()).to.deep.equal(actor.mbox_sha1sum);
            const crewHash = Crypto.createHash('sha1');
            crewHash.update('mailto:crew@serenity.org');
            const group = {
                mbox_sha1sum: crewHash.digest('base64'),
                objectType: 'Group'
            };
            expect(new Actor(group).getIdentifier()).to.deep.equal(group.mbox_sha1sum);
            done();
        });
    });

    describe('MboxSha1Sum', () => {
        it('should be able to get the inverse identifier', (done) => {
            const actorHash = Crypto.createHash('sha1');
            actorHash.update('mailto:mal@serenity.org');
            const actor = {
                openid: 'http://mal.openid.serenity.org/',
                objectType: 'Agent'
            };
            expect(new Actor(actor).getIdentifier()).to.deep.equal(actor.openid);
            const crewHash = Crypto.createHash('sha1');
            crewHash.update('mailto:crew@serenity.org');
            const group = {
                openid: 'http://crew.openid.serenity.org/',
                objectType: 'Group'
            };
            expect(new Actor(group).getIdentifier()).to.deep.equal(group.openid);
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
                return new Actor(actor);
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
                    return new Actor(actor);
                }).to.throw(Error, /"value" contains a conflict between exclusive peers \[mbox, mbox_sha1sum, openid, account]/);
                done();
            });
            it('shouldn\'t validate an mbox and openid', (done) => {
                const actor = {
                    mbox: 'mailto:mal@serenity.org',
                    openid: 'https://serenity.org/openid/mal'
                };
                expect(() => {
                    return new Actor(actor);
                }).to.throw(Error, /"value" contains a conflict between exclusive peers \[mbox, mbox_sha1sum, openid, account]/);
                done();
            });
        });
        describe('An Agent SHOULD NOT use Inverse Functional Identifiers that are also used as a Group identifier', () => {
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
                    return new Actor(actor);
                }).to.throw(Error, /asdasdasd/);
                done();
            });
        });
    });
});
