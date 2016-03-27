'use strict';
const Joi = require('joi');

const inverseIdentifiers = {
    mbox: Joi.string().uri({ scheme: 'mailto' }).optional(), //TODO: this doesn't do proper validation for this use case. Need to construct a simple regex for it.
    mbox_sha1sum: Joi.string().optional(), //TODO: How can we verify that it is a SHA1
    openid: Joi.string().uri().optional(), //TODO: Does Open ID require it to be HTTP/HTTPS? If so, restrict schemes for this.
    account: Joi.object().keys({
        homePage: Joi.string().uri().required(), //TODO: Do schemes need to be restricted here?
        name: Joi.string().required()
    }).optional().unknown(false)
};

module.exports = {
    schema: inverseIdentifiers,
    inverseIdentifierProperties: ['mbox', 'mbox_sha1sum', 'openid', 'account']
};