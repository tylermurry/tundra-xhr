'use strict';

var _requestBuilder = require('./requestBuilder');

var _requestBuilder2 = _interopRequireDefault(_requestBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('requestBuilder', function () {
  var request = void 0;
  var response = void 0;

  beforeEach(function () {
    request = {
      _url: 'url',
      _headers: 'request headers',
      _method: 'request method',
      _body: 'request content'
    };

    response = {
      _headers: { 1: ['1'], 2: ['2'] },
      _status: 'response status',
      _body: 'response body'
    };
  });

  it('should build a standard request', function () {
    expect((0, _requestBuilder2.default)(request, response)).toMatchSnapshot();
  });

  it('should build a request without a request', function () {
    expect((0, _requestBuilder2.default)(null, response)).toMatchSnapshot();
  });

  it('should build a request without a response', function () {
    expect((0, _requestBuilder2.default)(request, null)).toMatchSnapshot();
  });
});
//# sourceMappingURL=requestBuilder.test.js.map