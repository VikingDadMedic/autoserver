'use strict';

const { getReason } = require('../../error');
const { MODEL_TYPES } = require('../../constants');

// Builds requestinfo from request mInput
const buildRequestinfo = function ({
  requestid,
  timestamp,
  responsetime,
  ip,
  protocol,
  url,
  origin,
  path,
  method,
  protocolstatus,
  status = 'SERVER_ERROR',
  pathvars,
  queryvars,
  requestheaders,
  responseheaders,
  payload,
  operation,
  summary,
  topArgs: args,
  commandpath,
  command,
  modelName: model,
  response: {
    content: response,
    type: responsetype,
  } = {},
  modelscount,
  uniquecount,
  error,
}) {
  const responseData = MODEL_TYPES.includes(responsetype)
    ? response.data
    : response;
  const errorReason = error && getReason({ error });

  return {
    requestid,
    timestamp,
    responsetime,
    ip,
    protocol,
    url,
    origin,
    path,
    method,
    protocolstatus,
    status,
    pathvars,
    queryvars,
    requestheaders,
    responseheaders,
    payload,
    operation,
    summary,
    args,
    commandpath,
    command,
    model,
    responseData,
    responsetype,
    modelscount,
    uniquecount,
    error: errorReason,
  };
};

module.exports = {
  buildRequestinfo,
};
