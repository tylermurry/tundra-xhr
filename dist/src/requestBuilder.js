"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* eslint-disable no-underscore-dangle */

exports.default = function (request, response) {
  return {
    request: request ? {
      url: request._url.toString(),
      headers: request._headers,
      method: request._method,
      content: request._body
    } : null,
    response: response ? {
      headers: response._headers,
      statusCode: response._status,
      content: response._body
    } : null
  };
};
//# sourceMappingURL=requestBuilder.js.map