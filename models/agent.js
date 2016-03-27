'use strict';
const Joi = require('joi');
const InverseIdentifiers = require('./actorInverseIdentifiers');

const agentSchema = Joi.object()
    .keys({
        objectType: Joi.string().default('Agent').only('Agent').optional(),
        name: Joi.string().optional()
    })
    .keys(InverseIdentifiers.schema)
    .xor(InverseIdentifiers.inverseIdentifierProperties)
    .unknown(false);

function Agent(obj) {
    obj = Joi.attempt(obj, agentSchema);

    const keys = Object.keys(obj);
    const il = keys.length;
    for (let i = 0; i < il; ++i) {
        const key = keys[i];
        this[key] = obj[key];
    }

    return Object.freeze(this);
}

Agent.prototype.getIdentifier = function () {
    return this.mbox || this.mbox_sha1sum || this.openid || this.account;
};

module.exports = {
    Agent: Agent,
    schema: agentSchema
};