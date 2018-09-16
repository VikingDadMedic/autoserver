'use strict'

const { difference } = require('../../utils')
const { getFeatures } = require('../../filter')
const { FEATURES } = require('../constants')

const { genericValidators } = require('./generic')
const { filterValidator } = require('./filter')

// Validate database supports command features
const validateRuntimeFeatures = function(
  { features },
  { args, clientCollname },
) {
  const message = getErrorMessage({ args, features })

  if (message === undefined) {
    return
  }

  throw new Error(
    `${message} because the collection '${clientCollname}' does not support it`,
  )
}

// Fire the validator of each feature that is not supported by the
// database adapters
const getErrorMessage = function({ args, args: { filter }, features }) {
  const filterFeatures = getFeatures({ filter })

  const [messageA] = difference(FEATURES, features)
    .map(feature => checkFeature({ feature, features, args, filterFeatures }))
    .filter(message => message !== undefined)
  return messageA
}

const checkFeature = function({ feature, features, args, filterFeatures }) {
  // Features can be namespaced, e.g. `filter:*` all fire the same validator
  const validatorName = feature.replace(/:.*/u, '')

  const validator = VALIDATORS[validatorName]
  return validator({ features, args, filterFeatures })
}

const VALIDATORS = {
  ...genericValidators,
  filter: filterValidator,
}

module.exports = {
  validateRuntimeFeatures,
}
