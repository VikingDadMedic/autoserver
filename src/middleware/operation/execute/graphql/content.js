'use strict';

const { parseQuery } = require('./parse');
const { handleQuery } = require('./query');
const { getResolver } = require('./resolver');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');

const getContent = async function ({
  nextLayer,
  mInput,
  mInput: { idl: { shortcuts: { modelsMap }, GraphQLSchema: schema } },
  responses,
}) {
  const {
    query,
    variables,
    operationName,
    queryDocument,
    mainDef,
  } = getGraphQLInput(mInput);

  // Introspection GraphQL query
  if (isIntrospectionQuery({ query })) {
    const content = await handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
    return content;
  }

  // Normal GraphQL query
  const resolver = getResolver.bind(null, modelsMap);
  const cbFunc = fireNext.bind(null, {
    nextLayer,
    mInput,
    responses,
  });

  // This middleware spurs several children in parallel.
  // We need to manually call the performance monitoring functions to make
  // them work
  const data = await handleQuery({
    resolver,
    queryDocument,
    variables,
    mainDef,
    cbFunc,
  });

  return { data };
};

const getGraphQLInput = function ({ queryVars, payload = {}, goal }) {
  // Parameters can be in either query variables or payload
  // (including by using application/graphql)
  const { query, variables, operationName } = { ...queryVars, ...payload };

  // GraphQL parsing
  const {
    queryDocument,
    mainDef,
  } = parseQuery({ query, goal, operationName });

  return { query, variables, operationName, queryDocument, mainDef };
};

const fireNext = async function (
  { nextLayer, mInput, responses },
  actionInput,
) {
  const mInputA = { ...mInput, ...actionInput };

  const mInputB = await nextLayer(mInputA);

  // eslint-disable-next-line fp/no-mutating-methods
  responses.push(mInputB);

  return mInputB.response;
};

module.exports = {
  getContent,
};
