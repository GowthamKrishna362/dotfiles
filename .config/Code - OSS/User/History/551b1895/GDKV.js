import React, { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';

import { topViewCount } from 'Constants/deepAnalyticsV2';
import { SIZE_SIGNIFICANCE, ROUND_TO } from 'Constants/globalConstants';
import useDirectorSettings from 'CustomHooks/useDirectorSettings';
import useIsMount from 'CustomHooks/useIsMount';
import { useFetchLastAccessedDetailQuery, useFetchSearchCountQuery } from 'Reducers/deepAnalytics/deepAnalyticsApi';
import { selectViewBy, selectIncludeMoveData, selectFiltersAndViewBy } from 'Reducers/deepAnalytics/deepAnalyticsSlice';
import Button from 'Shared/Link/Button';
import Loader from 'Shared/Loader';
import Overlay from 'Shared/Overlay';
import BarChart from 'Shared/v2/charts/BarChartV2';
import { significant, reactiveSize, numberToMetric } from 'Utils';
import { classNames } from 'Utils/commonUtils';
import i18n from 'i18nUtil';

import useSearchChartDetails from '../useSearchChartDetails';
import useSearchDimensionDetails from '../useSearchDimensionDetails';

const ViewTopFile = lazy(() => import('../ViewTopFile'));
const { t } = i18n;

export default function ChartAndSummaryPanel() {
  const { maxElasticSearchRecords, maxElasticSearchCsvRecords } = useDirectorSettings();

  const queryFilterWithViewBy = useSelector(selectFiltersAndViewBy);
  const showMovedData = useSelector((state) => state.globalReducer.showMovedData);

  const selectedViewBy = useSelector(selectViewBy);
  const includeMoveData = useSelector(selectIncludeMoveData);
  const isInitialMount = useIsMount();
  const [showTopFilesTable, setShowTopFilesTable] = useState(false);

  const toggleShowTopFilesTable = () => setShowTopFilesTable((prev) => !prev);
  const { data: lastAccessedData, isFetching } = useFetchLastAccessedDetailQuery(queryFilterWithViewBy, {
    // Want refetch only on mount, not arg change, since args have fields which should not trigger a rerun.
    // Refetching on relevant arg change handled using serializeQueryArgs and default fetching behaviour
    refetchOnMountOrArgChange: isInitialMount,
  });
  const {
    data: { value: searchCount },
  } = useFetchSearchCountQuery();

  const { isHavingData, movedSize, movedNumber, filesSize, filesCount } = useSearchDimensionDetails(
    lastAccessedData,
    showMovedData && includeMoveData
  );
  const { data, xAxisLabel, legendItems, colorMap } = useSearchChartDetails(
    lastAccessedData,
    showMovedData && includeMoveData
  );
  const viewByLabel =
    selectedViewBy?.value === 'LAST_ACCESSED'
      ? t('global_graphUtils_lastAccessed')
      : t('global_graphUtils_lastModified');

  const renderTooltip = (barData = {}) => {
    const { category, isMiniBar, segmentIndex: index, color } = barData || {};
    const chartDetails = lastAccessedData?.chartDetails;
    const dataSource = isMiniBar ? chartDetails?.categoryMoved : chartDetails?.data?.[0];

    const ageBucket = chartDetails?.ageLabels?.[index] || category;

    const fileSize = reactiveSize(dataSource?.sizes?.[index] ?? 0, 3);
    const totalFileSize = reactiveSize(dataSource?.sizeFiles ?? 0, 3);
    const sizePercentage = significant({ inputNumber: dataSource?.sizePercents?.[index] ?? 0 });

    const fileCount = numberToMetric(dataSource?.counts?.[index] ?? 0, '', SIZE_SIGNIFICANCE, false, ROUND_TO);
    const totalFileCount = numberToMetric(dataSource?.numFiles ?? 0, '', SIZE_SIGNIFICANCE, false, ROUND_TO);
    const countPercentage = significant({ inputNumber: dataSource?.countPercents?.[index] ?? 0 });

    return (
      <>
        <div className="row no-gutters chart-tooltip-header bold">
          <span>{viewByLabel}</span>
          <span className="d-flex align-items-center">
            <span>
              &nbsp;{ageBucket}
              {isMiniBar ? ' |' : ''}
            </span>
            <span className="head-color" style={{ backgroundColor: color }} />
            <span>{isMiniBar ? t('da_dataMoved') : ''}</span>
          </span>
        </div>
        <div className="row no-gutters">
          <span className="col-md-5 left-text">{t('global_tooltip_size')}:</span>
          <span className="col-md-7">
            {fileSize} | {sizePercentage}% of {totalFileSize}
          </span>
        </div>
        <div className="row no-gutters">
          <span className="col-md-5 left-text">{t('global_file', { count: 0 })}:</span>
          <span className="col-md-7">
            {fileCount} | {countPercentage}% of {totalFileCount}
          </span>
        </div>
      </>
    );
  };

  const searchLoadingLabel = t('da_searchCount', {
    searchCount: numberToMetric(searchCount, '', SIZE_SIGNIFICANCE, false, ROUND_TO, true),
  });


  const getFileOverlayTitle = () => {
    const count = lastAccessedData ? lastAccessedData.numResults : 0;
    return count < topViewCount
      ? t('flowBased:da_filefoundAllData', { queryName: queryFilterWithViewBy.filters.name })
      : t('flowBased:da_filefoundAllDataWithCount', { queryName: queryFilterWithViewBy.filters.name });
  };

  return (
    <div className="row content-panel__summary">
      <div className="col-xl-8 col-7">
        <div className="da-card-section">
          <div className="da-card-section__title">{t('global_spaceConsumedBy', { spaceConsumedBy: viewByLabel })}</div>
          <div className="chart__outer-wpr">
            {!isFetching ? (
              <BarChart
                data={data}
                isStacked={false}
                xAxisLabel={xAxisLabel}
                yAxisLabel={viewByLabel}
                barHeight={15}
                barGap={10}
                marginLeft={0}
                showMiniBars
                miniBarLabel={t('global_dataMoved')}
                legendId="da-last-accessed"
                renderTooltip={renderTooltip}
                legendItems={legendItems}
                colorMap={colorMap}
              />
            ) : (
              <Loader type="spinner" size="xs" status={searchLoadingLabel} />
            )}
          </div>
        </div>
      </div>

      <div className="col-xl-4 col-5">
        <div className="da-card-section">
          <div className="da-card-section__title">{t('da_resultSummary')}</div>
          <div className="da-card-stats">
            <div className="results-data">
              <div className="col-6 size">
                <div className="label">{t('da_size')} </div>
                {!isFetching ? (
                  <div className="value">{filesSize}</div>
                ) : (
                  <div className="loadingWrap">
                    <Loader type="dots" theme="blue" />
                  </div>
                )}
                {movedSize !== 0 && !isFetching && (
                  <div className="distinct">
                    {t('da_moved')}: {movedSize} |&nbsp;
                    {significant({ inputNumber: lastAccessedData.chartDetails.movedSizePercentage })}%
                  </div>
                )}
              </div>
              <div className="col-6 number">
                <div className="label">{t('flowBased:da_fileNumber')} </div>
                {!isFetching ? (
                  <div className="value">{filesCount}</div>
                ) : (
                  <div className="loadingWrap">
                    <Loader type="dots" theme="blue" />
                  </div>
                )}
                {movedNumber !== 0 && !isFetching && (
                  <div className="distinct">
                    {t('da_moved')}: {movedNumber} |&nbsp;
                    {significant({ inputNumber: lastAccessedData.chartDetails.movedCountPercentage })}%
                  </div>
                )}
              </div>
            </div>

            {maxElasticSearchRecords > 0 && !isFetching && (
              <div className={classNames('toggle-files-table', { disabled: !isHavingData })}>
                <Button
                  onClick={toggleShowTopFilesTable}
                  iconConfig={{ iconClass: 'ICON_MAXIMIZE_SOLID' }}
                  label={t('flowBased:da_viewFileFound')}
                  underline
                />
              </div>
            )}

            {showTopFilesTable && (
              <Overlay
                title={getFileOverlayTitle()}
                backLinkText={t('global_backToQuery', { query: queryFilterWithViewBy.filters.name })}
                backCallback={toggleShowTopFilesTable}
                closeCallback={toggleShowTopFilesTable}
              >
                <Suspense fallback={<Loader type="spinner" />}>
                  <ViewTopFile
                    ageLabels={lastAccessedData.chartDetails.ageLabels}
                    maxElasticSearchCsvRecords={maxElasticSearchCsvRecords}
                    queryName={queryFilterWithViewBy.filters.name}
                    filters={queryFilterWithViewBy.filters}
                  />
                </Suspense>
              </Overlay>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
