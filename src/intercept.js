/* eslint-disable no-underscore-dangle */

import xhrMock, { proxy } from 'xhr-mock';
import buildRequest from './requestBuilder';
import submitRequestData from './submitRequest';

const proxyIntercept = (port = 9091, callback, realXHR) => async (req, res) => proxy(req, res)
  .then(async (finalResponse) => {
    const builtRequest = buildRequest(req, finalResponse);

    await submitRequestData(builtRequest, port, true, realXHR);

    if (callback) callback(builtRequest);

    return res;
  });

export default (port, callback) => {
  const realXHR = global.XMLHttpRequest;

  xhrMock.setup();
  xhrMock.use(proxyIntercept(port, callback, realXHR));
};
