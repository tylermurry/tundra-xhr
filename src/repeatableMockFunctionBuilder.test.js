import { once } from 'xhr-mock';
import buildRepeatMap from './requestRepeatMapBuilder';
import buildRepeatableMockFunction from './repeatableMockFunctionBuilder';
import buildRequestId from './requestIdBuilder';

const buildRequest = (method, url) => ({ request: { method, url } });

jest.mock('xhr-mock', () => ({
  once: jest.fn(),
}));

describe('repeatableMockFunctionBuilder', () => {
  const requests = [
    buildRequest('GET', 'http://some.url'),
    buildRequest('GET', 'http://some.url'),
  ];

  const response = {
    statusCode: 200,
    headers: [],
    content: 'something',
  };

  // Dummy builder to satisfy the buildResponse function
  class ResponseBuilder {
    constructor() { this.response = ''; }

    status(status) { this.response = `${this.response} ${status}`; return this; }

    headers(headers) { this.response = `${this.response} ${headers}`; return this; }

    body(body) { this.response = `${this.response} ${body}`; return this; }
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should build a function when no input is given', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];

    buildRepeatableMockFunction(null, repeatMap, request, response);

    expect(once.mock.calls[0][0](null, new ResponseBuilder())).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'first\' is given', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'FIRST' };

    expect(
      buildRepeatableMockFunction(config, repeatMap, request, response)(null, new ResponseBuilder()),
    ).toMatchSnapshot();
    expect(once).not.toHaveBeenCalled();
  });

  it('should build a function when a repeatMode of \'last\' is given '
    + 'and invocations do not exceed the number of repeats', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'LAST' };

    buildRepeatableMockFunction(config, repeatMap, request, response);

    expect(once.mock.calls[0][0](null, new ResponseBuilder())).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'last\' is given '
    + 'and invocations exceed the number of repeats', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'LAST' };

    repeatMap[buildRequestId(request)].invocations = 3;

    expect(
      buildRepeatableMockFunction(config, repeatMap, request, response)(null, new ResponseBuilder()),
    ).toMatchSnapshot();
    expect(once).not.toHaveBeenCalled();
  });
});
