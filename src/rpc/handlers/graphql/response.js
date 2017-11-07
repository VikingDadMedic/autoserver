'use strict';

const { omit, omitBy } = require('../../../utilities');

// Apply GraphQL-specific error response transformation
const transformError = function ({ response: { content: { error } } }) {
  const errors = getError(error);

  // According to GraphQL spec, `data` should be `null` if `errors` is set
  return { data: null, errors };
};

// GraphQL spec error format
const getError = function ({
  type,
  title,
  description: message,
  details: stack,
  protocolstatus: status,
  ...extraContent
}) {
  // Content following GraphQL spec
  // Custom information not following GraphQL spec is always rendered
  const extraContentA = omit(extraContent, 'status');
  const error = { message, title, type, status, ...extraContentA, stack };

  const errorA = omitBy(error, val => val === undefined);

  return [errorA];
};

module.exports = {
  transformError,
};
