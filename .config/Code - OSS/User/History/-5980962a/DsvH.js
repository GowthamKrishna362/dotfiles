import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';

import SearchBox from 'Components/Shared/SearchBox';
import TanstackTable from 'Components/Shared/TanstackTable';
import { useFetchTagsListQuery } from 'Reducers/deepAnalytics/deepAnalyticsApi';
import { classNames } from 'Utils/commonUtils';
import { oddEvenRowClassName } from 'Utils/tableUtils';
import i18n from 'i18nUtil';

import './tagLibrarySummary.scss';
import useTagLibraryTableColumns from './useTagLibraryTableColumns';

const { t } = i18n;

const getRowClass = (row) => {
  const { depth } = row;
  if (depth === 0) {
    return classNames('key-row', { 'is-collapsed': !row.getIsExpanded() });
  }
  return oddEvenRowClassName(row.index);
};

export default function TagLibrarySummary() {
  const { data, isFetching } = useFetchTagsListQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const tags = useMemo(() => data?.tags || [], [data]);
  const columns = useTagLibraryTableColumns();

  const tableInstance = useReactTable({
    data: tags,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: ({ id }) => id,
    getSubRows: (row) => row.values,
    enableColumnResizing: false,
    enableSortingRemoval: false,
  });

  const { globalFilter = '' } = tableInstance.getState();

  return (
    <div className="tag-library-summary">
      <div className="mb-2">{t('da_tagLibrarySummary')}</div>
      <SearchBox
        searchKey={globalFilter}
        size="lg"
        handleSearch={(term) => {
          tableInstance.setGlobalFilter(term);
        }}
      />
      <div className="tag-library-summary__table">
        <TanstackTable
          tableInstance={tableInstance}
          showLoader={isFetching}
          rowClass={getRowClass}
        />
      </div>
    </div>
  );
}
