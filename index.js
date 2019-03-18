/* eslint-disable global-require */

module.exports = {
  replayProfile: require('./dist/src/replay').default,
  interceptXHRCalls: require('./dist/src/intercept').default,
};
