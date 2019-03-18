import buildRepeatMap from './requestRepeatMapBuilder';
import buildRepeatableMockFunction from './repeatableMockFunctionBuilder';
import buildRequestId from './requestIdBuilder';

const buildRequest = (method, url) => ({ request: { method, url } });

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

  it('should build a function when no input is given', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];

    expect(`${buildRepeatableMockFunction(null, repeatMap, request, response)}`).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'first\' is given', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'FIRST' };

    expect(`${buildRepeatableMockFunction(config, repeatMap, request, response)}`).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'last\' is given '
    + 'and invocations do not exceed the number of repeats', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'LAST' };

    expect(`${buildRepeatableMockFunction(config, repeatMap, request, response)}`).toMatchSnapshot();
  });

  it('should build a function when a repeatMode of \'last\' is given '
    + 'and invocations exceed the number of repeats', () => {
    const repeatMap = buildRepeatMap(requests);
    const { request } = requests[0];
    const config = { repeatMode: 'LAST' };

    repeatMap[buildRequestId(request)].invocations = 3;

    expect(`${buildRepeatableMockFunction(config, repeatMap, request, response)}`).toMatchSnapshot();
  });
});
