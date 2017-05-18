'use strict';


const { findKey } = require('lodash');

const { EngineError } = require('../../error');


// Decides which interface to use (e.g. GraphQL) according to route
const interfaceNegotiator = function () {
  return async function interfaceNegotiator(input) {
    const { info, route } = input;
    const interf = findKey(interfaces, test => test({ route }));
    if (!interf) {
      throw new EngineError(`Unsupported interface: ${route}`, { reason: 'UNSUPPORTED_INTERFACE' });
    }
    info.interface = interf;

    const response = await this.next(input);
    return response;
  };
};
const interfaceNegotiation = () => ({ info: { interface: interf } }) => interf;

const interfaces = {

  graphql: ({ route }) => route === 'graphql',

  graphiql: ({ route }) => route === 'graphiql',

  graphqlprint: ({ route }) => route === 'graphqlprint',

};


module.exports = {
  interfaceNegotiation,
  interfaceNegotiator,
};
