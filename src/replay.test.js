import xhrMock from 'xhr-mock';
import replay, { matchingFunction, requestMatches } from './replay';
import { WILDCARD_MARKER } from './stringSimilarity';
import submitRequestData from './submitRequest';
import buildRepeatableMockFunction from './repeatableMockFunctionBuilder';

const emptyProfile = require('./fixtures/profiles/no-requests');
const singleRequest = require('./fixtures/profiles/single-request');
const multipleRequests = require('./fixtures/profiles/multiple-requests');

jest.mock('xhr-mock', () => ({
  reset: jest.fn(),
  setup: jest.fn(),
  use: jest.fn(),
}));

jest.mock('./submitRequest', () => jest.fn());
jest.mock('./repeatableMockFunctionBuilder', () => jest.fn());

describe('replay', () => {
  let profileRequest;
  let request;
  let response;

  const baseProfileRequest = {
    method: 'GET',
    url: 'http://www.someurl.com',
    headers: {
      abc: ['123'],
      xyz: ['456'],
    },
    content: 'body',
  };

  const baseRequest = {
    _url: 'http://www.someurl.com',
    _method: 'GET',
    _headers: {
      abc: ['123'],
      xyz: ['456'],
    },
    _body: 'body',
  };

  const baseResponse = {
    _status: 200,
    _headers: {
      abc: ['321'],
    },
    _body: 'body1',
  };

  describe('requestMatches', () => {
    beforeEach(() => {
      jest.resetAllMocks();

      profileRequest = JSON.parse(JSON.stringify(baseProfileRequest));
      request = JSON.parse(JSON.stringify(baseRequest));
      response = JSON.parse(JSON.stringify(baseResponse));
    });

    it('should match a standard request on all factors and an empty matching config', () => {
      expect(requestMatches({}, profileRequest, request)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a null matching config', () => {
      expect(requestMatches(null, profileRequest, request)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a matching config with headers to omit', () => {
      profileRequest.headers.xyz = 'something else';
      expect(requestMatches({ headersToOmit: ['xyz'] }, profileRequest, request)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors and a matching config with debugging enabled', () => {
      const config = { debuggingEnabled: true, debugPort: 9091 };

      expect(requestMatches(config, profileRequest, request)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy url', () => {
      profileRequest.url = `http://www.${WILDCARD_MARKER}.com`;
      expect(requestMatches({}, profileRequest, request)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy header', () => {
      profileRequest.headers.abc = [`1${WILDCARD_MARKER}3`];
      expect(requestMatches({}, profileRequest, request)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should match a standard request on all factors with a fuzzy body', () => {
      profileRequest.body = `b${WILDCARD_MARKER}y`;
      expect(requestMatches({}, profileRequest, request)).toBe(true);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the URL doesn\'t match', () => {
      profileRequest.url = 'bad';
      expect(requestMatches({}, profileRequest, request)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the headers don\'t match', () => {
      profileRequest.headers.abc = 'bad';
      expect(requestMatches({}, profileRequest, request)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the method doesn\'t match', () => {
      profileRequest.method = 'bad';
      expect(requestMatches({}, profileRequest, request)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should not match a standard request because the body doesn\'t match', () => {
      profileRequest.method = 'POST';
      profileRequest.content = 'bad';
      expect(requestMatches({}, profileRequest, request)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });
  });

  describe('matchingFunction', () => {
    beforeEach(() => {
      jest.resetAllMocks();

      profileRequest = JSON.parse(JSON.stringify(baseProfileRequest));
      request = JSON.parse(JSON.stringify(baseRequest));
      response = JSON.parse(JSON.stringify(baseResponse));
    });

    it('should return the correct mock function when everything matches and debugging is enabled', () => {
      buildRepeatableMockFunction.mockImplementation(() => () => 'correct mock function');

      const mockFunction = matchingFunction({ debuggingEnabled: true }, null, profileRequest, null, null);

      expect(mockFunction(request, response)).toBe('correct mock function');
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should provide the correct mock function when everything matches and debugging is disabled', () => {
      buildRepeatableMockFunction.mockImplementation(() => () => 'correct mock function');

      const mockFunction = matchingFunction({ }, null, profileRequest, null, null);

      expect(mockFunction(request, response)).toBe('correct mock function');
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });

    it('should provide the mocking function that returns false when something doesn\'t match', () => {
      const mockFunction = matchingFunction({ }, null, profileRequest, null, null);

      profileRequest.url = 'something different';

      expect(mockFunction(request, response)).toBe(false);
      expect(submitRequestData.mock.calls).toMatchSnapshot();
    });
  });

  describe('default', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should mock requests for an empty profile', () => {
      replay(emptyProfile, {});

      expect(xhrMock.reset).toBeCalled();
      expect(xhrMock.setup).toBeCalled();
      expect(xhrMock.use.mock.calls).toEqual([]);
    });

    it('should mock requests for a profile with a single request', () => {
      replay(singleRequest, {});

      expect(xhrMock.reset).toBeCalled();
      expect(xhrMock.setup).toBeCalled();
      expect(xhrMock.use.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and the default repeat mode', () => {
      replay(multipleRequests, {});

      expect(xhrMock.reset).toBeCalled();
      expect(xhrMock.setup).toBeCalled();
      expect(xhrMock.use.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and a repeat mode of \'first\'', () => {
      replay(multipleRequests, { repeatMode: 'first' });

      expect(xhrMock.reset).toBeCalled();
      expect(xhrMock.setup).toBeCalled();
      expect(xhrMock.use.mock.calls).toMatchSnapshot();
    });

    it('should mock requests for a profile with two requests and a repeat mode of \'last\'', () => {
      replay(multipleRequests, { repeatMode: 'last' });

      expect(xhrMock.reset).toBeCalled();
      expect(xhrMock.setup).toBeCalled();
      expect(xhrMock.use.mock.calls).toMatchSnapshot();
    });
  });
});
