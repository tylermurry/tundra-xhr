import interceptCalls from './intercept';
import submitRequestData from './submitRequest';

function makeFakeRequest() {
  // It's not possible to both mock XHR and make a 'fake' real request.
  // Instead, we're calling out to a real URL that will likely always be
  // there and unlikely to change. #tradeoffs

  return new Promise(((resolve) => {
    const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef

    xhr.open('GET', 'http://httpstat.us/200');
    xhr.onload = resolve;
    xhr.send();
  }));
}

jest.mock('./submitRequest', () => jest.fn());

describe('intercept', () => {
  it('should proxy the request properly', async () => {
    const callback = jest.fn();

    interceptCalls(undefined, callback);

    await makeFakeRequest();

    // Dear future self, please forgive this mortal sin. Fix when able.
    callback.mock.calls[0][0].response.headers['date'] = 'static date';
    submitRequestData.mock.calls[0][0].response.headers['date'] = 'static date';

    expect(callback.mock.calls).toMatchSnapshot();
    expect(submitRequestData.mock.calls).toMatchSnapshot();
  });
});
