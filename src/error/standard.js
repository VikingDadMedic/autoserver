'use strict';

const { omitBy } = require('../utilities');

const { getReason, getGenericProps } = require('./reasons');
const { normalizeError } = require('./main');

// Gets normalized error information
const getStandardError = function ({
  log: {
    logInfo: {
      url: instance,
      status = 'SERVER_ERROR',
      protocolStatus,
      protocol,
      method,
      headers,
      queryVars,
      operation,
      action,
      fullAction,
      model,
      args,
      command,
      requestId,
    } = {},
  },
  error: oError,
}) {
  const error = normalizeError({ error: oError });
  const type = getReason({ error });
  const { title } = getGenericProps({ error });
  const {
    message: description,
    stack: outerStack,
    innererror: { stack: details = outerStack } = {},
    extra,
  } = error;

  // Order matters, as this will be kept in final output
  const newError = Object.assign(
    {
      type,
      title,
      description,
      instance,
      status,
      protocol_status: protocolStatus,
      protocol,
      method,
      headers,
      queryVars,
      operation,
      action: action && action.name,
      action_path: fullAction,
      model,
      args,
      command: command && command.name,
    },
    extra,
    {
      request_id: requestId,
      details,
    },
  );

  // Do not expose undefined values
  const standardError = omitBy(newError, val => val === undefined);

  return standardError;
};

module.exports = {
  getStandardError,
};
