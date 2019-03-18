'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xhrMock = require('xhr-mock');

var _requestRepeatMapBuilder = require('./requestRepeatMapBuilder');

var _requestRepeatMapBuilder2 = _interopRequireDefault(_requestRepeatMapBuilder);

var _repeatableMockFunctionBuilder = require('./repeatableMockFunctionBuilder');

var _repeatableMockFunctionBuilder2 = _interopRequireDefault(_repeatableMockFunctionBuilder);

var _requestIdBuilder = require('./requestIdBuilder');

var _requestIdBuilder2 = _interopRequireDefault(_requestIdBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var buildRequest = function buildRequest(method, url) {
  return { request: { method: method, url: url } };
};

jest.mock('xhr-mock', function () {
  return {
    once: jest.fn()
  };
});

describe('repeatableMockFunctionBuilder', function () {
  var requests = [buildRequest('GET', 'http://some.url'), buildRequest('GET', 'http://some.url')];

  var response = {
    statusCode: 200,
    headers: [],
    content: 'something'
  };

  // Dummy builder to satisfy the buildResponse function

  var ResponseBuilder = function () {
    function ResponseBuilder() {
      _classCallCheck(this, ResponseBuilder);

      this.response = '';
    }

    _createClass(ResponseBuilder, [{
      key: 'status',
      value: function status(_status) {
        this.response = this.response + ' ' + _status;return this;
      }
    }, {
      key: 'headers',
      value: function headers(_headers) {
        this.response = this.response + ' ' + _headers;return this;
      }
    }, {
      key: 'body',
      value: function body(_body) {
        this.response = this.response + ' ' + _body;return this;
      }
    }]);

    return ResponseBuilder;
  }();

  beforeEach(function () {
    jest.resetAllMocks();
  });

  it('should build a function when no input is given', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;


    (0, _repeatableMockFunctionBuilder2.default)(null, repeatMap, request, response);

    expect(_xhrMock.once.mock.calls[0][0](null, new ResponseBuilder())).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'first\' is given', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'FIRST' };

    expect((0, _repeatableMockFunctionBuilder2.default)(config, repeatMap, request, response)(null, new ResponseBuilder())).toMatchSnapshot();
    expect(_xhrMock.once).not.toHaveBeenCalled();
  });

  it('should build a function when a repeatMode of \'last\' is given ' + 'and invocations do not exceed the number of repeats', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'LAST' };

    (0, _repeatableMockFunctionBuilder2.default)(config, repeatMap, request, response);

    expect(_xhrMock.once.mock.calls[0][0](null, new ResponseBuilder())).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'last\' is given ' + 'and invocations exceed the number of repeats', function () {
    var repeatMap = (0, _requestRepeatMapBuilder2.default)(requests);
    var request = requests[0].request;

    var config = { repeatMode: 'LAST' };

    repeatMap[(0, _requestIdBuilder2.default)(request)].invocations = 3;

    expect((0, _repeatableMockFunctionBuilder2.default)(config, repeatMap, request, response)(null, new ResponseBuilder())).toMatchSnapshot();
    expect(_xhrMock.once).not.toHaveBeenCalled();
  });
});
//# sourceMappingURL=repeatableMockFunctionBuilder.test.js.map