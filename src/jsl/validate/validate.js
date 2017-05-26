'use strict';


const { findNodeAt } = require('acorn/dist/walk');

const { parseNode } = require('../parse');
const { throwJslError } = require('../error');
const { getGlobalKeys } = require('./global');
const allRules = require('./rules');
const { printNode } = require('./print');


// Validate JSL by parsing it
const validateJsl = function ({ jslText, type }) {
  const node = parseNode({ jslText, type });

  const globalKeys = getGlobalKeys();
  const rules = allRules[type].getRules({ globalKeys });

  const throwError = getThrowError({ jslText, type });
  const validate = validateNode.bind(null, throwError, rules);

  findNodeAt(node, null, null, validate);
};

const validateNode = function (throwError, rules, type, node) {
  const rule = rules[type];
  if (!rule) {
    const message = `Cannot use the following node: '${printNode(node)}'`;
    throwError(message);
  }

  if (rule === true) { return; }

  const message = rule(node);
  if (typeof message === 'string') {
    throwError(message);
  }
};

const getThrowError = function ({ jslText, type }) {
  return msg => {
    const message = `Invalid inline function: '${jslText}'.
${msg}.
Please use a normal function instead`;
    throwJslError({ type, message });
  };
};


module.exports = {
  validateJsl,
};
