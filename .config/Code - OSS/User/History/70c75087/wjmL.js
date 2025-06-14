import { isNullOrUndefined, trimObj } from '..';

export let apiController = {};

/**
 * @param specificApis
 * List of specific apis that we want to cancel/avoid cancellation.
 *
 * @param cancelOtherApis
 * Boolean to decide wether to cancel the specific APIs or to cancel all apis except specificAPIs.
 */
export function abortPendingRequests(specificApis = [], cancelOtherApis = false, cleanApiController = true) {
  Object.keys(apiController).forEach((key) => {
    if (specificApis.length) {
      if (cancelOtherApis && !specificApis.includes(key)) {
        apiController[key].abort();
      } else if (!cancelOtherApis && !!specificApis.find((apiUrl) => key.startsWith(apiUrl))) {
        apiController[key].abort();
      }
    } else {
      apiController[key].abort();
    }
  });
  if (cleanApiController) {
    apiController = {};
  }
}

/**
 * @param cancelPrevReq: boolean (true if we want to cancel existing request before making a new one)
 */
export function fetchHelper(url, headers, cancelPrevReq) {
  if (window.AbortController) {
    if (cancelPrevReq && apiController[url + headers.method]) {
      apiController[url + headers.method].abort();
    }
    apiController[url + headers.method] = new AbortController();
    headers.signal = apiController[url + headers.method].signal;
  }
  return fetch(url, headers);
}

/**
 * @param url
 * Url to be modified
 *
 * @param params
 * Object of params to be appended in the url
 */
export function appendURLParams(url, params = {}) {
  let paramsLength = Object.keys(params).length;
  if (paramsLength) {
    url = url + '?';
    let currLen = paramsLength;
    for (var key in params) {
      currLen--;
      url += `${key}=${params[key]}${currLen ? '&' : ''}`;
    }
  }
  return url;
}

export function buildQueryParamsString(data = {}) {
  return Object.entries(data).reduce(
    (acc, [key, value], index, arr) => `${acc}${key}=${value}${index < arr.length - 1 ? '&' : ''}`,
    ''
  );
}

export function prepareHeaders({ headers, selectedSite, method, contentType, type, isFileUpload }) {
  const siteId = selectedSite?.id || JSON.parse(sessionStorage.getItem('siteId'));
  const preparedHeaders = {
    Accept: type,
    ...(siteId !== 'ALL_SITES' && { siteIds: [siteId] }),
  };

  if (method === 'GET') {
    return { ...preparedHeaders, ...headers };
  }

  if (!isFileUpload) {
    preparedHeaders['Content-Type'] = `${contentType};charset=utf-8`;
  }

  const [, xsrfToken] = document.cookie
    .split('; ')
    .find((c) => c.startsWith('XSRF-TOKEN='))
    .split('=');

  preparedHeaders['X-XSRF-TOKEN'] = xsrfToken;

  return { ...preparedHeaders, ...headers };
}

export function prepareBody({ body, isFileUpload }) {
  if (isNullOrUndefined(body)) return body;
  const useOriginalBody = typeof body === 'string' || body instanceof String || isFileUpload;
  return useOriginalBody ? body : JSON.stringify(trimObj(body));
}

export const transformErrorResponse = (error) => error.data.errors;
