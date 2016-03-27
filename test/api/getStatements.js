'use strict';
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const Server = require('../../server').Server;

describe('GET Statements', () => {
    it('should be able to get statements with nothing specified', (done) => {
        Server.inject('/statements', (res) => {
            expect(res.result).to.deep.equal('I\'m Hapi');
            done();
        });
    });
    it('shouldn\'t be able to get statements with an invalid statementId', (done) => {
        Server.inject('/statements?statementId=asdf', (res) => {
            expect(res.result).to.deep.equal({
                statusCode: 400,
                error: 'Bad Request',
                message: 'child \"statementId\" fails because [single value of \"statementId\" fails because [\"statementId\" must be a valid GUID]]',
                validation: {
                    source: 'query',
                    keys: ['statementId']
                }
            });
            expect(res.statusCode).to.equal(400);
            done();
        });
    });
});