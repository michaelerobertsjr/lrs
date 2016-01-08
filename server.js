'use strict';

const Hapi = require('hapi');
const Good = require('good');

const actorSchema = require('../models/actor');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 8000
});

server.route({
    method: 'GET',
    path: '/statements',
    handler: (request, reply) => {

        reply('Hello').code(200);
    },
    config: {
        validate: {
            query: {
                statementId: Joi.array().items(Joi.string().guid().required()).single().optional(),
                voidedStatementId: Joi.array().items(Joi.string().guid().required()).single().optional(),
                agent: Joi.array().items(actorSchema.required()).optional(), //TODO: This should only support Agents & Identified Groups, not Anonymous Groups
                verb: Joi.array().items(Joi.string().uri().required()).single().optional(),
                activity: Joi.array().items(Joi.string().uri().required()).single().optional(),
                registration: Joi.array().items(Joi.string().guid().required()).single().optional(),
                related_activities: Joi.boolean().default(false).optional(),
                related_agents: Joi.boolean().default(false).optional(),
                since: Joi.date().iso().optional(),
                until: Joi.date().iso().optional(),
                limit: Joi.number().positive().integer().default(0).optional(),
                format: Joi.string().valid('ids', 'exact', 'canonical').default('exact').optional(),
                attachments: Joi.boolean().default(false).optional(),
                ascending: Joi.boolean().default(false).optional()
            }
        }
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, (err)  => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    // Start the server
    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});
