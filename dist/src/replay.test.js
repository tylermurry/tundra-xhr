'use strict';

var _xhrMock = require('xhr-mock');

var _xhrMock2 = _interopRequireDefault(_xhrMock);

var _replay = require('./replay');

var _replay2 = _interopRequireDefault(_replay);

var _stringSimilarity = require('./stringSimilarity');

var _submitRequest = require('./submitRequest');

var _submitRequest2 = _interopRequireDefault(_submitRequest);

var _repeatableMockFunctionBuilder = require('./repeatableMockFunctionBuilder');

var _repeatableMockFunctionBuilder2 = _interopRequireDefault(_repeatableMockFunctionBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyProfile = require('./fixtures/profiles/no-requests');
var singleRequest = require('./fixtures/profiles/single-request');
var multipleRequests = require('./fixtures/profiles/multiple-requests');

jest.mock('xhr-mock', function () {
  return {
    reset: jest.fn(),
    setup: jest.fn(),
    use: jest.fn()
  };
});

jest.mock('./submitRequest', function () {
  return jest.fn();
});
jest.mock('./repeatableMockFunctionBuilder', function () {
  return jest.fn();
});

describe('replay', function () {
  var profileRequest = void 0;
  var request = void 0;
  var response = void 0;

  var baseProfileRequest = {
    method: 'GET',
    url: 'http://www.someurl.com',
    headers: {
      abc: ['123'],
      xyz: ['456']
    },
    content: 'body'
  };

  var baseRequest = {
    _url: 'http://www.someurl.com',
    _method: 'GET',
    _headers: {
      abc: ['123'],
      xyz: ['456']
    },
    _body: 'body'
  };

  var baseResponse = {
    _status: 200,
    _headers: {
      abc: ['321']
    },
    _body: 'body1'
  };

  describe('requestMatches', function () {
    beforeEach(function () {
      jest.resetAllMocks();

      profileRequest = JSON.parse(JSON.stringify(baseProfileRequest));
      request = JSON.parse(JSON.stringify(baseRequest));
      response = JSON.parse(JSON.stringify(baseResponse));
    });

    it('should match a standard request on all factors and an empty matching config', function () {
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(true);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a null matching config', function () {
      expect((0, _replay.requestMatches)(null, profileRequest, request)).toBe(true);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a matching config with headers to omit', function () {
      profileRequest.headers.xyz = 'something else';
      expect((0, _replay.requestMatches)({ headersToOmit: ['xyz'] }, profileRequest, request)).toBe(true);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a matching config with debugging enabled', function () {
      var config = { debuggingEnabled: true, debugPort: 9091 };

      expect((0, _replay.requestMatches)(config, profileRequest, request)).toBe(true);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy url', function () {
      profileRequest.url = 'http://www.' + _stringSimilarity.WILDCARD_MARKER + '.com';
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(true);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy header', function () {
      profileRequest.headers.abc = ['1' + _stringSimilarity.WILDCARD_MARKER + '3'];
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(true);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy body', function () {
      profileRequest.body = 'b' + _stringSimilarity.WILDCARD_MARKER + 'y';
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(true);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the URL doesn\'t match', function () {
      profileRequest.url = 'bad';
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(false);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the headers don\'t match', function () {
      profileRequest.headers.abc = 'bad';
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(false);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the method doesn\'t match', function () {
      profileRequest.method = 'bad';
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(false);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the body doesn\'t match', function () {
      profileRequest.method = 'POST';
      profileRequest.content = 'bad';
      expect((0, _replay.requestMatches)({}, profileRequest, request)).toBe(false);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });
  });

  describe('matchingFunction', function () {
    beforeEach(function () {
      jest.resetAllMocks();

      profileRequest = JSON.parse(JSON.stringify(baseProfileRequest));
      request = JSON.parse(JSON.stringify(baseRequest));
      response = JSON.parse(JSON.stringify(baseResponse));
    });

    it('should return the correct mock function when everything matches and debugging is enabled', function () {
      _repeatableMockFunctionBuilder2.default.mockImplementation(function () {
        return function () {
          return 'correct mock function';
        };
      });

      var mockFunction = (0, _replay.matchingFunction)({ debuggingEnabled: true }, null, profileRequest, null, null);

      expect(mockFunction(request, response)).toBe('correct mock function');
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should provide the correct mock function when everything matches and debugging is disabled', function () {
      _repeatableMockFunctionBuilder2.default.mockImplementation(function () {
        return function () {
          return 'correct mock function';
        };
      });

      var mockFunction = (0, _replay.matchingFunction)({}, null, profileRequest, null, null);

      expect(mockFunction(request, response)).toBe('correct mock function');
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });

    it('should provide the mocking function that returns false when something doesn\'t match', function () {
      var mockFunction = (0, _replay.matchingFunction)({}, null, profileRequest, null, null);

      profileRequest.url = 'something different';

      expect(mockFunction(request, response)).toBe(false);
      expect(_submitRequest2.default.mock.calls).toMatchSnapshot();
    });
  });

  describe('default', function () {
    beforeEach(function () {
      jest.resetAllMocks();
    });

    it('should mock requests for an empty profile', function () {
      (0, _replay2.default)(emptyProfile, {});

      expect(_xhrMock2.default.reset).toBeCalled();
      expect(_xhrMock2.default.setup).toBeCalled();
      expect(_xhrMock2.default.use.mock.calls).toEqual([]);
    });

    it('should mock requests for a profile with a single request', function () {
      (0, _replay2.default)(singleRequest, {});

      expect(_xhrMock2.default.reset).toBeCalled();
      expect(_xhrMock2.default.setup).toBeCalled();
      expect(_xhrMock2.default.use.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and the default repeat mode', function () {
      (0, _replay2.default)(multipleRequests, {});

      expect(_xhrMock2.default.reset).toBeCalled();
      expect(_xhrMock2.default.setup).toBeCalled();
      expect(_xhrMock2.default.use.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and a repeat mode of \'first\'', function () {
      (0, _replay2.default)(multipleRequests, { repeatMode: 'first' });

      expect(_xhrMock2.default.reset).toBeCalled();
      expect(_xhrMock2.default.setup).toBeCalled();
      expect(_xhrMock2.default.use.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and a repeat mode of \'last\'', function () {
      (0, _replay2.default)(multipleRequests, { repeatMode: 'last' });

      expect(_xhrMock2.default.reset).toBeCalled();
      expect(_xhrMock2.default.setup).toBeCalled();
      expect(_xhrMock2.default.use.mock.calls).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=replay.test.js.map