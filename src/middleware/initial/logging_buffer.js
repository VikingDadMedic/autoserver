'use strict';

// Buffer logging calls, to ensure those calls get the full requestInfo
// information
const loggingBuffer = async function (nextFunc, input) {
  const { log } = input;

  try {
    // Buffer logging calls
    await log.setBuffered(true);

    const response = await nextFunc(input);
    return response;
  } finally {
    // Release logging calls, now that all possiblelog.add() calls
    // have been performed
    await log.setBuffered(false);
  }
};

module.exports = {
  loggingBuffer,
};
