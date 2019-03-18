/* eslint-disable no-underscore-dangle */

export default (request, response) => ({
  request: request ? {
    url: request._url.toString(),
    headers: request._headers,
    method: request._method,
    content: request._body,
  } : null,
  response: response ? {
    headers: response._headers,
    statusCode: response._status,
    content: response._body,
  } : null,
});
