'use strict';
const Joi = require('joi');

const Agent = require('./agent').Agent;
const Group = require('./group').Group;

const agentType = 'Agent';
const groupType = 'Group';

const actorSchema = Joi.object()
    .keys({
        objectType: Joi.string().default(agentType).only([agentType, groupType]).optional()
    })
    .unknown(true)
    .required();

function Actor(obj) {
    if (!(this instanceof Actor)) {
        return new Actor(obj);
    }

    obj = Joi.attempt(obj, actorSchema);

    if (obj.objectType === agentType) {
        return new Agent(obj);
    }
    return new Group(obj);
}

module.exports = {
    Actor: Actor
};