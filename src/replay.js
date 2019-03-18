/* eslint-disable no-underscore-dangle */

import 'url';
import xhrMock from 'xhr-mock';
import omit from 'lodash.omit';
import buildRequestRepeatMap from './requestRepeatMapBuilder';
import stringIsSimilarTo from './stringSimilarity';
import buildRequestId from './requestIdBuilder';
import removeURLPrefix from './removeURLPrefix';
import submitRequestData from './submitRequest';
import buildRepeatableMockFunction from './repeatableMockFunctionBuilder';
import buildRequest from './requestBuilder';

const DEFAULT_CONFIG = {
  debuggingEnabled: true,
  debugPort: 9091,
};

export const requestMatches = (matchingConfig, profileRequest, request) => {
  const headersToOmit = matchingConfig ? matchingConfig.headersToOmit : null;
  const requestHeaders = JSON.stringify(omit(request._headers, headersToOmit));
  const profileRequestHeaders = JSON.stringify(omit(profileRequest.headers, headersToOmit));

  const urlMatches = stringIsSimilarTo(removeURLPrefix(profileRequest.url), removeURLPrefix(request._url.toString()));
  const bodyMatches = request._method !== 'GET' ? stringIsSimilarTo(profileRequest.content, request._body) : true;
  const headersMatch = stringIsSimilarTo(profileRequestHeaders, requestHeaders);
  const methodMatches = request._method === profileRequest.method;

  return urlMatches && methodMatches && bodyMatches && headersMatch;
};

export const matchingFunction = (matchingConfig, requestRepeatMap, request, response, realXHR) => {
  const repeatableMockFunction = buildRepeatableMockFunction(matchingConfig, requestRepeatMap, request, response);

  return (req, res) => {
    const everythingMatches = requestMatches(matchingConfig, request, req);

    if (matchingConfig && matchingConfig.debuggingEnabled) {
      submitRequestData(
        buildRequest(req, res),
        matchingConfig.debugPort,
        everythingMatches,
        realXHR,
      );
    }

    if (everythingMatches) {
      return repeatableMockFunction(req, res);
    }
    return false;
  };
};

export default (profileRequests, config) => {
  const realXHR = global.XMLHttpRequest;

  xhrMock.setup();
  xhrMock.reset();

  const defaultedConfig = { ...DEFAULT_CONFIG, ...config };
  const repeatMap = buildRequestRepeatMap(profileRequests);

  profileRequests.forEach(({ request, response }) => {
    const requestRepeatMap = repeatMap[buildRequestId(request)];
    requestRepeatMap.invocations += 1;

    xhrMock.use(
      request.method.toLowerCase(),
      new RegExp('.*'),
      matchingFunction(defaultedConfig, repeatMap, request, response, realXHR),
    );
  });
};
