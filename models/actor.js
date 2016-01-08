'use strict';
const Joi = require('joi');

const inverseIdentifiers = {
    mbox: Joi.string().uri({ scheme: 'mailto' }).optional(), //TODO: this doesn't do proper validation for this use case. Need to construct a simple regex for it.
    mbox_sha1sum: Joi.string().optional(),
    openid: Joi.string().uri().optional(), //TODO: Does Open ID require it to be HTTP/HTTPS? If so, restrict schemes for this.
    account: Joi.object().keys({
        homePage: Joi.string().uri().required(), //TODO: Do schemes need to be restricted here?
        name: Joi.string().required()
    }).optional()
};
const agentSchema = Joi.object()
    .keys({
        objectType: Joi.string().default('Agent').only('Agent').optional(),
        name: Joi.string().optional()
    })
    .keys(inverseIdentifiers)
    .xor(['mbox', 'mbox_sha1sum', 'openid', 'account']);

const groupSchema = Joi.object()
    .keys({
        objectType: Joi.string().only('Group').required(),
        name: Joi.string().optional(),
        member: Joi.array().items(agentSchema.required()).optional()
    });

const anonymousGroupSchema = groupSchema.requiredKeys(['member']);

const identifiedGroupSchema = groupSchema
    .keys(inverseIdentifiers)
    .xor(['mbox', 'mbox_sha1sum', 'openid', 'account']);

const actorSchema = Joi.alternatives()
    .when('objectType', {
        is: 'Group',
        then: Joi.alternatives().try(identifiedGroupSchema, anonymousGroupSchema),
        otherwise: agentSchema // If we don't have Group specified, then it's either invalid or can only be an Agent.
    });

module.exports = actorSchema;
