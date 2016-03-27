'use strict';
const Joi = require('joi');
const InverseIdentifiers = require('./actorInverseIdentifiers');
const Agent = require('./agent');

const sharedGroupSchema = Joi.object()
    .keys({
        objectType: Joi.string().only('Group').required(),
        name: Joi.string().optional(),
        member: Joi.array().items(Agent.schema.required()).optional()
    })
    .unknown(false);

const anonymousGroupSchema = sharedGroupSchema
    .requiredKeys(['member']);

const identifiedGroupSchema = sharedGroupSchema
    .keys(InverseIdentifiers.schema)
    .xor(InverseIdentifiers.inverseIdentifierProperties);

const groupSchema = Joi.alternatives().try(identifiedGroupSchema, anonymousGroupSchema);

function Group(obj) {
    obj = Joi.attempt(obj, groupSchema);

    const keys = Object.keys(obj);
    const il = keys.length;
    for (let i = 0; i < il; ++i) {
        const key = keys[i];
        this[key] = obj[key];
    }

    return Object.freeze(this);
}

Group.prototype.getIdentifier = function () {
    return this.mbox || this.mbox_sha1sum || this.openid || this.account;
};

module.exports = {
    Group: Group,
    schema: groupSchema
};