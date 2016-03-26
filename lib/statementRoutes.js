// 'use strict';
// var Boom = require('boom');
// var Path = require('path');
//
// exports.routes = [];
//
// exports.routes.push({
//     method: 'GET',
//     path: '/statements',
//     config: {
//         pre: [
//             {
//                 method: 'statement.validateQuery(params)'
//             },
//             {
//                 method: 'statements.get(params)',
//                 assign: 'statements'
//             }
//         ],
//         handler: function (request, reply) {
//
//             reply.view('index', request.pre);
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/hapidays',
//     config: {
//         handler: {
//             view: 'hapidays'
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/updates',
//     config: {
//         pre: [
//             [
//                 {
//                     method: 'github.issues()',
//                     assign: 'issues'
//                 },
//                 {
//                     method: 'github.pullRequests()',
//                     assign: 'pullRequests'
//                 },
//                 {
//                     method: 'github.commits()',
//                     assign: 'commits'
//                 },
//                 {
//                     method: 'changelog.milestones()',
//                     assign: 'milestones'
//                 }
//             ],
//             {
//                 method: 'changelog.build',
//                 assign: 'changelog'
//             }
//         ],
//         handler: function (request, reply) {
//
//             request.pre.limit = request.query.limit || 10;
//
//             var milestones = request.pre.milestones;
//             for (var m = 0, ml = milestones.length; m < ml; ++m) {
//                 var milestone = milestones[m];
//                 var issues = request.pre.changelog[milestone.title];
//                 for (var i = 0, il = issues.length; i < il; ++i) {
//                     var issue = issues[i];
//                     for (var l = 0, ll = issue.labels.length; l < ll; ++l) {
//                         if (issue.labels[l].name === 'release notes') {
//                             milestone.release_notes = issue;
//                             break;
//                         }
//                     }
//
//                     if (milestone.release_notes) {
//                         break;
//                     }
//                 }
//             }
//
//             reply.view('updates', request.pre);
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/tutorials/{tutorial?}',
//     config: {
//         handler: function (request, reply) {
//
//             var tutorial;
//
//             if (request.params.tutorial) {
//                 if (Tutorials[request.params.tutorial]) {
//                     tutorial = Tutorials[request.params.tutorial];
//                 }
//                 else {
//                     return reply(Boom.notFound());
//                 }
//             }
//             else {
//                 tutorial = Tutorials.default;
//             }
//
//             request.server.methods.markdown.parse(tutorial.contents, function (err, html) {
//
//                 if (err) {
//                     return reply(Boom.internal(err));
//                 }
//
//                 var context = {
//                     tutorials: Tutorials.all,
//                     active: tutorial.title,
//                     html: html
//                 };
//
//                 reply.view('tutorial', context);
//             });
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/api/index.html',
//     config: {
//         handler: function (request, reply) {
//
//             return reply.redirect('/api');
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/api/v{tag}',
//     config: {
//         handler: function (request, reply) {
//
//             return reply.redirect('/api/' + request.params.tag);
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/api/{tag?}',
//     config: {
//         pre: [[
//             {
//                 method: 'npm.version()',
//                 assign: 'latest'
//             },
//             {
//                 method: 'npm.versions()',
//                 assign: 'versions'
//             }
//         ]],
//         handler: function (request, reply) {
//
//             var current = request.params.tag || request.pre.latest;
//             request.server.methods.github.reference(current, function (err, ref) {
//
//                 reply.view('api', {
//                     html: ref,
//                     versions: request.pre.versions,
//                     tag: current
//                 });
//             });
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/community',
//     config: {
//         handler: function (request, reply) {
//
//             reply.view('community', { community: Community });
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/contribute',
//     config: {
//         pre: [
//             {
//                 method: 'github.repos()',
//                 assign: 'repos'
//             },
//             [
//                 {
//                     method: 'github.newContributorIssues',
//                     assign: 'newContributorIssues'
//                 },
//                 {
//                     method: 'github.helpWantedIssues',
//                     assign: 'helpWantedIssues'
//                 }
//             ]
//         ],
//         handler: function (request, reply) {
//
//             reply.view('contribute', request.pre);
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/governance',
//     config: {
//         pre: [
//             {
//                 method: 'github.governance()',
//                 assign: 'governance'
//             }
//         ],
//         handler: function (request, reply) {
//
//             reply.view('document', {
//                 title: 'hapi.js community governance',
//                 document: request.pre.governance
//             });
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/styleguide',
//     config: {
//         pre: [
//             {
//                 method: 'github.styleGuide()',
//                 assign: 'styleGuide'
//             }
//         ],
//         handler: function (request, reply) {
//
//             reply.view('document', {
//                 title: 'hapi.js style guide',
//                 document: request.pre.styleGuide
//             });
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/operating',
//     config: {
//         pre: [
//             {
//                 method: 'github.guidelines()',
//                 assign: 'guidelines'
//             }
//         ],
//         handler: function (request, reply) {
//
//             reply.view('document', {
//                 title: 'hapi.js operating guidelines',
//                 document: request.pre.guidelines
//             });
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/resources',
//     config: {
//         handler: function (request, reply) {
//
//             reply.view('resources', { resources: Resources });
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/help',
//     config: {
//         handler: {
//             view: 'help'
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/favicon.ico',
//     config: {
//         handler: {
//             file: 'public/img/favicon.png'
//         }
//     }
// });
//
// exports.routes.push({
//     method: 'GET',
//     path: '/public/{path*}',
//     config: {
//         handler: {
//             directory: {
//                 path: Path.join(__dirname, '..', 'public'),
//                 index: false,
//                 redirectToSlash: false
//             }
//         }
//     }
// });
