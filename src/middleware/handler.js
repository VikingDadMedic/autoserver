'use strict';

const { getMiddlewarePerf } = require('../perf');

const { chain } = require('./chain');
const initial = require('./initial');
const protocol = require('./protocol');
const operation = require('./operation');
const action = require('./action');
const command = require('./command');
const database = require('./database');

const middleware = [

  // Initial layer

  // Error handler's of error handler itself
  initial.failureHandler,
  // Error handler, which sends final response, if errors
  initial.errorHandler,
  // Start the main performance counter
  initial.startMainPerf,

  // Emit event about how long the request handling takes
  initial.perfEvent,
  // Emit "call" events
  initial.callEvent,

  // Protocol layer

  // Protocol-related validation middleware
  protocol.protocolValidation,
  // Abort request after a certain delay
  protocol.setRequestTimeout,
  // Set protocol full name
  protocol.getProtocolName,
  // Retrieves timestamp
  protocol.getTimestamp,
  // Sets requestId, serverId, serverName
  protocol.setRequestIds,
  // Retrieves IP
  protocol.getIp,
  // Parse URL and path into protocol-agnostic format
  protocol.parseUrl,
  // Parse protocol method into protocol-agnostic format
  protocol.parseMethod,
  // Parse URL query string into protocol-agnostic format
  protocol.parseQueryString,
  // Parse request payload into protocol-agnostic format
  protocol.parsePayload,
  // Parse headers into protocol-agnostic format
  protocol.parseHeaders,
  // Parse operation-wide settings, and application-specific headers
  protocol.parseSettingsParams,
  // Retrieves input.route, using input.path
  protocol.router,

  // Sends final response, if success
  protocol.sendResponse,
  // Sets response status
  protocol.getStatus,
  // Sets how long it took to handle request before responding it
  protocol.setResponseTime,

  // Operation layer

  // Pick the operation
  operation.operationNegotiator,
  // Operation-related input validation middleware
  operation.operationValidationIn,

  // Operation-related output validation middleware
  operation.operationValidationOut,
  // Remove response data if settings silent is specified
  operation.silent,

  // Translates operation-specific calls into generic instance actions
  operation.operationExecute,

  // Action layer

  // Add action-related input information
  action.addActionInputInfo,
  // Action-related validation middleware
  action.actionValidation,
  // Process client arguments
  action.handleArgs,

  // Add action-related output information
  action.addActionOutputInfo,
  // Transform response according to action-specific logic
  action.normalizeAction,

  // Turn one action into 0, 1 or several commands
  action.actionExecute,

  // Normalize empty values (undefined, null) by removing their key
  action.normalizeEmpty,

  // Command layer

  // Add command-related information
  command.addCommandInfoIn,
  // Command-related validation middleware
  command.commandValidation,
  // Normalize input
  command.normalization,
  // Apply attribute aliases, in input
  command.renameAliasesInput,
  // Resets readonly attributes in `args.newData`
  command.handleReadonly,
  // Process `attr.transforms` and `attr.value`
  command.handleTransforms,
  // Apply user-defined default values
  command.userDefaults,
  // Apply system-defined default values, e.g. order_by 'id+'
  command.systemDefaults,
  // Paginate input
  command.handlePaginationInput,

  // Apply attribute aliases, in output
  command.renameAliasesOutput,
  // Process `attr.compute`
  command.handleComputes,
  // Paginate output
  command.handlePaginationOutput,

  // Database layer

  // Authorization middleware
  database.authorization,
  // Custom data validation middleware
  database.dataValidation,

  // Do the database action, protocol and operation-agnostic
  database.databaseExecute,
];

const getMiddleware = function () {
  return chain(
    middleware,
    {
      before: [
        getMiddlewarePerf,
      ],
    },
  )[0];
};

module.exports = {
  getMiddleware,
};
