'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xhrMock = require('xhr-mock');

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildResponse = function buildResponse(matchResponse, response) {
  return matchResponse.status(response.statusCode).headers(response.headers).body(response.content);
};

exports.default = function (config, repeatMap, request, response) {
  var repeatMode = config && config.repeatMode && config.repeatMode.toUpperCase();
  var baseMockFunction = function baseMockFunction(req, res) {
    return buildResponse(res, response);
  };

  if (repeatMode === 'FIRST') {
    return baseMockFunction;
  }

  var _repeatMap$buildReque = repeatMap[(0, _requestIdBuilder2.default)(request)],
      invocations = _repeatMap$buildReque.invocations,
      repeated = _repeatMap$buildReque.repeated;


  if (invocations >= repeated) {
    if (repeatMode === 'LAST') {
      return baseMockFunction;
    }
  }

  return (0, _xhrMock.once)(baseMockFunction);
};
//# sourceMappingURL=repeatableMockFunctionBuilder.js.map