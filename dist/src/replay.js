'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchingFunction = exports.requestMatches = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable no-underscore-dangle */

require('url');

var _xhrMock = require('xhr-mock');

var _xhrMock2 = _interopRequireDefault(_xhrMock);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestRepeatMapBuilder = require('./requestRepeatMapBuilder');

var _requestRepeatMapBuilder2 = _interopRequireDefault(_requestRepeatMapBuilder);

var _stringSimilarity = require('./stringSimilarity');

var _stringSimilarity2 = _interopRequireDefault(_stringSimilarity);

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

var _removeURLPrefix = require('./removeURLPrefix');

var _removeURLPrefix2 = _interopRequireDefault(_removeURLPrefix);

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

var _repeatableMockFunctionBuilder = require('./repeatableMockFunctionBuilder');

var _repeatableMockFunctionBuilder2 = _interopRequireDefault(_repeatableMockFunctionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_CONFIG = {
  debuggingEnabled: true,
  debugPort: 9091
};

var buildRequest = function buildRequest(request, response) {
  return {
    request: request ? {
      url: request._url.toString(),
      headers: request._headers,
      method: request._method,
      content: request._body
    } : null,
    response: response ? {
      headers: response._headers,
      statusCode: response._status,
      content: response._body
    } : null
  };
};

var requestMatches = exports.requestMatches = function requestMatches(matchingConfig, profileRequest, request) {
  var headersToOmit = matchingConfig ? matchingConfig.headersToOmit : null;
  var requestHeaders = JSON.stringify((0, _lodash2.default)(request._headers, headersToOmit));
  var profileRequestHeaders = JSON.stringify((0, _lodash2.default)(profileRequest.headers, headersToOmit));

  var urlMatches = (0, _stringSimilarity2.default)((0, _removeURLPrefix2.default)(profileRequest.url), (0, _removeURLPrefix2.default)(request._url.toString()));
  var bodyMatches = request._method !== 'GET' ? (0, _stringSimilarity2.default)(profileRequest.content, request._body) : true;
  var headersMatch = (0, _stringSimilarity2.default)(profileRequestHeaders, requestHeaders);
  var methodMatches = request._method === profileRequest.method;

  return urlMatches && methodMatches && bodyMatches && headersMatch;
};

var matchingFunction = exports.matchingFunction = function matchingFunction(matchingConfig, requestRepeatMap, request, response, realXHR) {
  var repeatableMockFunction = (0, _repeatableMockFunctionBuilder2.default)(matchingConfig, requestRepeatMap, request, response);

  return function (req, res) {
    var everythingMatches = requestMatches(matchingConfig, request, req);

    if (matchingConfig && matchingConfig.debuggingEnabled) {
      (0, _submitRequest2.default)(buildRequest(req, res), matchingConfig.debugPort, everythingMatches, realXHR);
    }

    if (everythingMatches) {
      return repeatableMockFunction(req, res);
    }
    return false;
  };
};

exports.default = function (profileRequests, config) {
  var realXHR = global.XMLHttpRequest;

  _xhrMock2.default.setup();
  _xhrMock2.default.reset();

  var defaultedConfig = _extends({}, DEFAULT_CONFIG, config);
  var repeatMap = (0, _requestRepeatMapBuilder2.default)(profileRequests);

  profileRequests.forEach(function (_ref) {
    var request = _ref.request,
        response = _ref.response;

    var requestRepeatMap = repeatMap[(0, _requestIdBuilder2.default)(request)];
    requestRepeatMap.invocations += 1;

    _xhrMock2.default.use(request.method.toLowerCase(), new RegExp('.*'), matchingFunction(defaultedConfig, repeatMap, request, response, realXHR));
  });
};
//# sourceMappingURL=replay.js.map