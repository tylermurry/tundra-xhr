/* eslint-disable global-require */

module.exports = {
  replayProfile: require('./dist/src/replay').default,
  interceptCalls: require('./dist/src/intercept').default,
};
