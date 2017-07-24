'use strict';

const { cloneDeep } = require('lodash');

const { validateBasic } = require('./validate_basic');
const { validateSyntax } = require('./syntax');
const { validateLimits } = require('./validate_limits');
const { renameArgs } = require('./rename');

// Process client-supplied args: validates them and add them to JSL variables
// Also rename them camelcase
const handleArgs = async function (nextFunc, input) {
  const { log, args, jsl } = input;

  const clonedArgs = cloneDeep(args);
  const nextInput = jsl.addToInput(input, { $ARGS: clonedArgs });

  try {
    validateArgs({ input });
    nextInput.args = renameArgs({ args });

    const response = await nextFunc(nextInput);
    return response;
  } catch (error) {
    // Added only for final error handler
    log.add({ args: clonedArgs });

    throw error;
  }
};

const validateArgs = function ({
  input: { args, action, serverOpts: { maxDataLength } },
}) {
  validateBasic({ args });
  validateSyntax({ args, action, maxDataLength });
  validateLimits({ args, maxDataLength });
};

module.exports = {
  handleArgs,
};
