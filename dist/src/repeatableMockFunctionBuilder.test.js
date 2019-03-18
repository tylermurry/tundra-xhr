'use strict';

var _requestRepeatMapBuilder = require('./requestRepeatMapBuilder');

var _requestRepeatMapBuilder2 = _interopRequireDefault(_requestRepeatMapBuilder);

var _repeatableMockFunctionBuilder = require('./repeatableMockFunctionBuilder');

var _repeatableMockFunctionBuilder2 = _interopRequireDefault(_repeatableMockFunctionBuilder);

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildRequest = function buildRequest(method, url) {
  return { request: { method: method, url: url } };
};

describe('repeatableMockFunctionBuilder', function () {
  var requests = [buildRequest('GET', 'http://some.url'), buildRequest('GET', 'http://some.url')];

  var response = {
    statusCode: 200,
    headers: [],
    content: 'something'
  };

  it('should build a function when no input is given', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;


    expect('' + (0, _repeatableMockFunctionBuilder2.default)(null, repeatMap, request, response)).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'first\' is given', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'FIRST' };

    expect('' + (0, _repeatableMockFunctionBuilder2.default)(config, repeatMap, request, response)).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'last\' is given ' + 'and invocations do not exceed the number of repeats', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'LAST' };

    expect('' + (0, _repeatableMockFunctionBuilder2.default)(config, repeatMap, request, response)).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'last\' is given ' + 'and invocations exceed the number of repeats', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'LAST' };

    repeatMap[(0, _requestIdBuilder2.default)(request)].invocations = 3;

    expect('' + (0, _repeatableMockFunctionBuilder2.default)(config, repeatMap, request, response)).toMatchSnapshot();
  });
});
//# sourceMappingURL=repeatableMockFunctionBuilder.test.js.map