import buildRequest from './requestBuilder';

describe('requestBuilder', () => {
  let request;
  let response;

  beforeEach(() => {
    request = {
      _url: 'url',
      _headers: 'request headers',
      _method: 'request method',
      _body: 'request content',
    };

    response = {
      _headers: { 1: ['1'], 2: ['2'] },
      _status: 'response status',
      _body: 'response body',
    };
  });

  it('should build a standard request', () => {
    expect(buildRequest(request, response)).toMatchSnapshot();
  });

  it('should build a request without a request', () => {
    expect(buildRequest(null, response)).toMatchSnapshot();
  });

  it('should build a request without a response', () => {
    expect(buildRequest(request, null)).toMatchSnapshot();
  });
});
