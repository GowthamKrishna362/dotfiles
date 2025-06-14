// We can reassign params since rtk wraps slice in immer

/* eslint no-param-reassign: ["error", { "props": false }] */
import { createSelector, createSlice } from '@reduxjs/toolkit';

import { VIEW_BY_OPTIONS } from 'Constants/deepAnalyticsV2';
import { FILTERS_MD } from 'Constants/deepAnalyticsV2/filterConstants';
import { extractQueryFilters } from 'Utils/deepAnalyticsUtilsV2/filterUtils';
import { convertQueryDetailsToPayload } from 'Utils/deepAnalyticsUtilsV2/filterUtils/filterConverters';
import { isEmpty, isNullOrUndefined } from 'Utils/index';

import { deepAnalyticsApi } from './deepAnalyticsApi';

// State which should be reset to default when unmounting query page
const querySpecificInitialState = {
  queryDetails: null,
  hasUnsavedFilters: false,
  queryActionData: {},
};

const deepAnalyticsSlice = createSlice({
  name: 'deepAnalyticsSlice',
  initialState: {
    ...querySpecificInitialState,
    // Any states added below will not be reset on unmount, remember to handle cleanup
    viewBy: VIEW_BY_OPTIONS[0],
  },
  reducers: {
    initializeQueryDetails: (state, action) => {
      state.queryDetails = action.payload;
    },
    onRunNewQuery: (state, action) => {
      state.queryDetails = action.payload;
      state.hasUnsavedFilters = true;
    },
    onRunEditedQuery: (state, action) => {
      state.queryDetails = action.payload;
      state.hasUnsavedFilters = true;
    },
    updateQueryFiltersFromBatchFilters: (state, action) => {
      state.queryDetails = { ...state.queryDetails, ...action.payload };
      state.hasUnsavedFilters = true;
    },
    onSaveQuerySuccess: (state) => {
      state.hasUnsavedFilters = false;
    },
    onFilterSummaryPillRemove: (state, action) => {
      const filterId = action.payload;
      state.hasUnsavedFilters = true;
      state.queryDetails[filterId] = FILTERS_MD[filterId].noSelectionState;
    },
    resetQueryDashboardState: (state) => ({
      ...state,
      ...querySpecificInitialState,
    }),
    onOpenQueryActionsPopup: (state, action) => {
      state.queryActionData = action.payload;
    },
    updateViewBy: (state, action) => {
      state.viewBy = action.payload;
    },
    onRenameNewQuery: (state, action) => {
      state.queryDetails.name = action.payload;
    },
    onUpdateVisibility: (state, action) => {
      const { ownerFirstName, ownerLastName, ownerId, isPrivate } = action.payload;
      state.queryDetails = {
        ...state.queryDetails,
        ownerFirstName,
        ownerLastName,
        ownerId,
        isPrivate,
      };
    },
  },
});

export const {
  initializeQueryDetails,
  onRunNewQuery,
  onRunEditedQuery,
  updateQueryFiltersFromBatchFilters,
  resetQueryDashboardState,
  onSaveQuerySuccess,
  updateViewBy,
  onFilterSummaryPillRemove,
  onOpenQueryActionsPopup,
  onUpdateVisibility,
  onRenameNewQuery,
} = deepAnalyticsSlice.actions;

export const selectQueryDetails = (state) => state.deepAnalyticsSlice.queryDetails;
export const selectQueryName = (state) => state.deepAnalyticsSlice.queryDetails.name;
export const selectIsQueryEditable = (state) => state.deepAnalyticsSlice.queryDetails.isEditable;
export const selectIsQueryDeletable = (state) => state.deepAnalyticsSlice.queryDetails.isDeletable;
export const selectIsQueryPrivate = (state) => state.deepAnalyticsSlice.queryDetails.isPrivate;
export const selectViewBy = (state) => state.deepAnalyticsSlice.viewBy;
export const selectHasUnsavedFilters = (state) => state.deepAnalyticsSlice.hasUnsavedFilters;
export const selectIncludeMoveData = (state) => state.deepAnalyticsSlice.queryDetails.includeMoveData;
export const selectIsSystemQuerySelected = (state) =>
  !isNullOrUndefined(state.deepAnalyticsSlice.queryDetails.queryType);
export const selectQueryActionData = (state) => state.deepAnalyticsSlice.queryActionData;
export const selectIsNewQuery = (state) => state.deepAnalyticsSlice.queryDetails.id === null;
export const selectQueryId = (state) => state.deepAnalyticsSlice.queryDetails?.id;

export const selectQueryFilters = createSelector([selectQueryDetails], (queryDetails) =>
  isEmpty(queryDetails) ? null : extractQueryFilters(queryDetails)
);

export const selectQueryOwnerDetails = createSelector([selectQueryDetails], (queryDetails) => {
  const { ownerFirstName, ownerLastName, ownerId } = queryDetails;
  return { ownerFirstName, ownerLastName, ownerId };
});

export const selectQueryAccessDetails = createSelector([selectQueryDetails], (queryDetails) => {
  const { isPrivate, isDeletable, isEditable } = queryDetails;
  return { isPrivate, isDeletable, isEditable };
});

export const selectQueryTimestamps = createSelector([selectQueryDetails], (queryDetails) => {
  const { modifiedTime, createdTime } = queryDetails;
  return { modifiedTime, createdTime };
});

const selectSharesData = (state) => deepAnalyticsApi.endpoints.fetchSharesDataAndSelectedVolumes.select()(state)?.data;

export const selectQueryPayloadBase = createSelector(
  [selectSharesData, selectQueryDetails],
  (sharesData, queryDetails) => {
    if (isEmpty(queryDetails) || isEmpty(sharesData)) return {};
    return convertQueryDetailsToPayload(queryDetails, sharesData, /* isUpdated */ false);
  }
);

export const selectQueryPayloadWithUpdationStatus = createSelector(
  [selectSharesData, selectQueryDetails, selectHasUnsavedFilters],
  (sharesData, queryDetails, hasUnsavedFilters) => {
    if (isEmpty(queryDetails) || isEmpty(sharesData)) return {};
    return convertQueryDetailsToPayload(queryDetails, sharesData, hasUnsavedFilters);
  }
);

export const selectFilerAndSharesData = createSelector(
  [selectQueryPayloadBase],
  (queryPayload) => queryPayload?.filerAndShares || {}
);

export const selectFiltersAndViewBy = createSelector(
  [selectQueryPayloadWithUpdationStatus, selectViewBy],
  (queryPayloadWithUpdationStatus, viewBy) => ({
    filters: queryPayloadWithUpdationStatus,
    viewBy: viewBy?.value,
  })
);

export const selectSearchDimensionAndSearchDetailsTablePayload = 
  createSelector(
    [selectFiltersAndViewBy, (state) => state.globalReducer.directorSettings.maxElasticSearchRecords],
    ({ filters, viewBy }, maxElasticSearchRecords) =>
    ({
      viewBy,
      filters,
      maxResults: maxElasticSearchRecords,
    })
  );

  


export default deepAnalyticsSlice.reducer;
