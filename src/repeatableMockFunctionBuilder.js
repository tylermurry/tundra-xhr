import { once } from 'xhr-mock';
import buildRequestId from './requestIdBuilder';

const buildResponse = (matchResponse, response) => matchResponse
  .status(response.statusCode)
  .headers(response.headers)
  .body(response.content);

export default (config, repeatMap, request, response) => {
  const repeatMode = config && config.repeatMode && config.repeatMode.toUpperCase();
  const baseMockFunction = (req, res) => buildResponse(res, response);

  if (repeatMode === 'FIRST') {
    return baseMockFunction;
  }

  const { invocations, repeated } = repeatMap[buildRequestId(request)];

  if (invocations >= repeated) {
    if (repeatMode === 'LAST') {
      return baseMockFunction;
    }
  }

  return once(baseMockFunction);
};
