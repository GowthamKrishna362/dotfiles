import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query';

import { getGetHeaders, getPostHeaders } from 'Actions/globalAction';
import { DA_DRILLDOWN_MAX_RESULT } from 'Constants/deepAnalyticsV2';
import {
  FETCH_SYSTEM_QUERIES,
  FETCH_USER_QUERIES,
  FILTER_DATA_SITES,
  FILTER_FILER,
  GET_ALL_TAGS,
  GET_SHARE_DIRECTORIES,
  SEARCH_LAST_ACCESS,
  SEARCH_COUNT,
  SEARCH_DIMENSION,
  SEARCH_DETAILS,
  RENAME_QUERY,
  DELETE_QUERY,
  SAVE_SAVEAS,
  GET_QUERY_SUMMARY_REPORT,
  UPDATE_QUERY_VISIBILITY,
  TAGGING_CONFIG,
  CSV_DETAILS,
  SEARCH_USAGE_OPTION,
  SEARCH_USAGE,
} from 'Constants/urlConstants';
import apiSlice from 'Reducers/apiSlice';
import { getStdTimezoneOffset } from 'Utils';
import { transformErrorResponse } from 'Utils/apiUtils';
import { extractFiltersFromPayload } from 'Utils/deepAnalyticsUtilsV2/filterUtils';

// TODO - Get from apiUtils after f-reactify-sites merge to master
const invalidateOnSuccess =
  (...tags) =>
  (_, error) =>
    error ? [] : tags;

// TODO - Merge these cache tags with sites cache tag constants after merge
export const CACHE_TAGS = {
  USER_QUERIES_LIST: 'USER_QUERIES_LIST',
  SHARES_DATA: 'SHARES_DATA',
};

export const deepAnalyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUserQueryList: builder.query({
      query: () => ({
        url: FETCH_USER_QUERIES,
        ...getGetHeaders(),
      }),
      providesTags: [CACHE_TAGS.USER_QUERIES_LIST],
    }),
    fetchSystemQueryList: builder.query({
      query: () => ({
        url: FETCH_SYSTEM_QUERIES,
        ...getGetHeaders(),
      }),
    }),
    fetchQueryDetailsById: builder.query({
      query: (queryId) => ({
        url: `${FILTER_DATA_SITES}/${queryId}`,
        ...getGetHeaders(),
      }),
      transformErrorResponse,
    }),
    fetchTagsList: builder.query({
      query: () => ({
        url: GET_ALL_TAGS,
        ...getGetHeaders(),
      }),
    }),
    saveQuery: builder.mutation({
      query: (queryDetailsRequestDto) => ({
        url: `${FILTER_DATA_SITES}/${queryDetailsRequestDto.id}`,
        ...getPostHeaders(queryDetailsRequestDto),
        method: 'PUT',
      }),
    }),
    directoryDrilldownData: builder.infiniteQuery({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage, allPages) => {
          const totalDirectoriesFetched = allPages.flatMap((page) => page.paths).length;
          if (totalDirectoriesFetched >= lastPage.totalCount) {
            return undefined;
          }
          return lastPage.paths?.at(-1) || null;
        },
      },
      query: ({ queryArg, pageParam }) => ({
        url: GET_SHARE_DIRECTORIES,
        ...getPostHeaders({ ...queryArg, maxResults: DA_DRILLDOWN_MAX_RESULT, searchAfter: pageParam }),
      }),
    }),
    fetchSharesDataAndSelectedVolumes: builder.query({
      query: ({ queryId = null, queryType = null, includeDestroyedVolumes = false } = {}) => ({
        url: FILTER_FILER,
        ...getGetHeaders(),
        params: {
          ...(queryId !== null && { filterId: queryId }),
          ...(queryId !== null && queryType && { systemQueryType: queryType }),
          includeDestroyedVolumes,
        },
      }),
      providesTags: [CACHE_TAGS.SHARES_DATA],
    }),
    fetchSearchCount: builder.query({
      query: () => ({
        url: SEARCH_COUNT,
        ...getGetHeaders(),
      }),
    }),
    fetchUsagesOptions: builder.query({
      query: () => ({
        url: SEARCH_USAGE_OPTION,
        ...getGetHeaders(),
      }),
    }),
    fetchLastAccessedDetail: builder.query({
      query: ({ filters, viewBy }) => ({
        url: SEARCH_LAST_ACCESS,
        params: { viewBy },
        ...getPostHeaders(filters),
      }),
      serializeQueryArgs: ({ queryArgs, ...rest }) => {
        const { filters, viewBy } = queryArgs;
        // extract only relevant fields to be used as the cache key
        return defaultSerializeQueryArgs({ queryArgs: { ...extractFiltersFromPayload(filters), viewBy }, ...rest });
      },
      // If we go from filter state A -> B -> A, we need a refetch, so discard A when we move to B
      keepUnusedDataFor: 0,
    }),

    getSearchDimension: builder.query({
      query: ({ viewBy, maxResults, filters }) => ({
        url: SEARCH_DIMENSION,
        ...getPostHeaders(filters),
        method: 'POST',
        params: {
          viewBy,
          maxResults,
          timezoneoffsetMins: getStdTimezoneOffset(),
        },
      }),
    }),
    getSearchDetails: builder.query({
      query: ({ viewBy, maxResults, filters }) => ({
        url: SEARCH_DETAILS,
        ...getPostHeaders(filters),
        method: 'POST',
        params: {
          viewBy,
          maxResults,
        },
      }),
    }),
    getCSVData: builder.query({
      query: ({ querySize, queryFiles, viewBy, filters }) => ({
        url: CSV_DETAILS,
        ...getPostHeaders(filters,'text/csv'),
        method: 'POST',
        params: {
          querySize,
          queryFiles,
          timezoneoffsetMins: getStdTimezoneOffset(),
          viewBy,
        },
        responseHandler: "text"
      }),
    }),
    fetchQuerySummaryReportDataById: builder.query({
      query: (queryId) => ({
        url: `${GET_QUERY_SUMMARY_REPORT}/${queryId}`,
        ...getGetHeaders(),
      }),
      transformErrorResponse,
    }),
    fetchQuerySummaryReportDataByFilters: builder.query({
      query: (queryDetails) => ({
        url: GET_QUERY_SUMMARY_REPORT,
        ...getPostHeaders(queryDetails),
      }),
      transformErrorResponse,
    }),
    renameQuery: builder.mutation({
      query: ({ queryId, newName }) => ({
        url: `${RENAME_QUERY}/${queryId}`,
        params: {
          newFilterName: newName,
        },
        ...getPostHeaders(),
        method: 'PUT',
      }),
      invalidatesTags: invalidateOnSuccess(CACHE_TAGS.USER_QUERIES_LIST),
      transformErrorResponse,
    }),
    deleteQuery: builder.mutation({
      query: (id) => ({
        url: `${DELETE_QUERY}/${id}`,
        ...getPostHeaders(),
        method: 'DELETE',
      }),
      invalidatesTags: invalidateOnSuccess(CACHE_TAGS.USER_QUERIES_LIST),
      transformErrorResponse,
    }),
    createQuery: builder.mutation({
      query: (queryDetails) => ({
        url: SAVE_SAVEAS,
        ...getPostHeaders(queryDetails),
      }),
      invalidatesTags: invalidateOnSuccess(CACHE_TAGS.USER_QUERIES_LIST),
      transformErrorResponse,
    }),
    updateQueryVisibility: builder.mutation({
      query: ({ queryId, makePrivate }) => ({
        url: UPDATE_QUERY_VISIBILITY(queryId),
        params: {
          makePrivate,
        },
        ...getPostHeaders(),
        method: 'PUT',
      }),
      invalidatesTags: invalidateOnSuccess(CACHE_TAGS.USER_QUERIES_LIST),
      transformErrorResponse,
    }),
    fetchTaggingConfig: builder.query({
      query: () => ({
        url: TAGGING_CONFIG,
        ...getGetHeaders(),
      }),
      transformErrorResponse,
    }),
    fetchUsagesDetail: builder.query({
      query: (usagesParams) => ({
        url: SEARCH_USAGE,
        ...getPostHeaders(usagesParams),
      }),
    }),
  }),
  overrideExisting: 'throw',
});

export const {
  useFetchUserQueryListQuery,
  useFetchSystemQueryListQuery,
  useFetchQueryDetailsByIdQuery,
  useLazyFetchQueryDetailsByIdQuery,
  useLazyFetchTagsListQuery,
  useDirectoryDrilldownDataInfiniteQuery,
  useFetchSharesDataAndSelectedVolumesQuery,
  useLazyFetchSharesDataAndSelectedVolumesQuery,
  useFetchLastAccessedDetailQuery,
  useFetchSearchCountQuery,
  useGetSearchDimensionQuery,
  useGetSearchDetailsQuery,
  useLazyFetchQuerySummaryReportDataByIdQuery,
  useLazyFetchQuerySummaryReportDataByFiltersQuery,
  useFetchTaggingConfigQuery,
  useLazyGetCSVDataQuery,

  useSaveQueryMutation,
  useRenameQueryMutation,
  useDeleteQueryMutation,
  useCreateQueryMutation,
  useUpdateQueryVisibilityMutation,
  useFetchUsagesOptionsQuery,
  useFetchUsagesDetailQuery,
} = deepAnalyticsApi;
