'use strict';

const { dataToFilter } = require('../data_to_filter');
const { getCurrentData } = require('../current_data');

const readCommand = ({ args }) => ({
  command: 'read',
  args: {
    filter: dataToFilter({ args }),
  },
});

const updateCommand = function ({ args: { data: dataArg } }, { data: models }) {
  const currentData = getCurrentData({ dataArg, models });

  return {
    command: 'update',
    args: {
      currentData,
      newData: dataArg,
    },
  };
};

// "replace" action is split into two commands:
//   - first a "read" command retrieving current models
//     Pagination is disabled for that query.
//   - then a "update" command
// The reasons why we split "replace" action are:
//   - we need to know the current models so we can set args.currentData
const replaceAction = [
  { mInput: readCommand },
  { mInput: updateCommand },
];

module.exports = {
  replace: replaceAction,
};
