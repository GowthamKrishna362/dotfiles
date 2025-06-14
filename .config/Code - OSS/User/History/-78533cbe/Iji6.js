import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import { useDAFiltersEditorContext } from 'Components/Shared/DAFiltersEditor/DAFiltersEditorContext';
import IconLabel from 'Components/Shared/IconLabel';
import { FILTER_SUMMARY_BTN_ID } from 'Constants/deepAnalyticsV2';
import { FILTER_IDS, FILTER_MODIFIER_IDS } from 'Constants/deepAnalyticsV2/filterConstants';
import useIsMultiSite from 'CustomHooks/useIsMultiSite';
import useQueryDashboardFilterPopupActions from 'DeepAnalyticsV2/customHooks/useQueryDashboardFilterPopupActions';
import { selectQueryFilters } from 'Reducers/deepAnalytics/deepAnalyticsSlice';
import KButton from 'Shared/KButton';
import { convertQueryFiltersToPillsData } from 'Utils/deepAnalyticsUtilsV2/filterUtils/filterConverters';
import i18n from 'i18nUtil';

import FilterSummaryPills from './FilterSummaryPills';
import './filterSummary.scss';
import useHandlePartialSharesPill from './useHandlePartialSharesPill';

const { t } = i18n;

export default function FilterSummary() {
  const queryFilters = useSelector(selectQueryFilters);
  const { maxFilterDisplayTerms } = useSelector((state) => state.globalReducer.directorSettings);
  const isMultisite = useIsMultiSite();
  const hasMovedData = useSelector((state) => state.globalReducer.directorSettings.hasMovedData);

  const filterContainerRef = useRef();

  const { setSelectedMenuItem, menuOptions } = useDAFiltersEditorContext(queryFilters);
  const { openFilterEditorModal } = useQueryDashboardFilterPopupActions();

  const onSummaryPillClick = (filterId) => {
    let filterIdToOpen = filterId;
    if (filterId === FILTER_MODIFIER_IDS.INCLUDE_MOVE_DATA) {
      filterIdToOpen = FILTER_IDS.FILER_VOLUMES_SITES;
    }
    setSelectedMenuItem(menuOptions.find((item) => item.id === filterIdToOpen));
    openFilterEditorModal();
  };

  const queryFiltersSummaryPills = convertQueryFiltersToPillsData({
    queryFilters,
    pillClickHandler: onSummaryPillClick,
    maxFilterDisplayTerms,
    isMultisite,
    hasMovedData,
  });
  const filterPillsData = useHandlePartialSharesPill(queryFiltersSummaryPills, onSummaryPillClick);

  return (
    <div className="filter-summary">
      <span className="filter-summary__wrapper" ref={filterContainerRef}>
        <KButton
          theme={KButton.theme.WHITE}
          customClass={`pills-filter-button ${filterPillsData.length > 0 && 'active'}`}
          onClick={openFilterEditorModal}
          id={FILTER_SUMMARY_BTN_ID}
          height="tall"
        >
          <IconLabel
            icon="ICON_FILTER_LIST"
            iconPosition="icon-left"
            label={
              filterPillsData.length === 0
                ? t('global_graphUtils_filterBy')
                : `${t('global_filteredBy')} (${filterPillsData.length})`
            }
          />
        </KButton>
        {filterPillsData.length > 0 ? (
          <FilterSummaryPills
            filterPillsData={filterPillsData}
            parentRef={filterContainerRef}
            onSummaryPillClick={onSummaryPillClick}
          />
        ) : (
          t('da_noFilterApplied')
        )}
      </span>
    </div>
  );
}
