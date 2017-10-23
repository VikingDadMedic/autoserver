'use strict';

const routes = require('./routes');
const methods = require('./methods');
const { handler } = require('./handler');

const operation = {
  name: 'graphqlprint',
  title: 'GraphQLPrint',
  routes,
  methods,
  handler,
};

module.exports = operation;
