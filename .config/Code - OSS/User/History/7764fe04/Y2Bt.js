import { isEmpty, isEmptyArray, jsonEqual } from 'Utils/index';
import { DATASTORE_ENTITY_TYPES, clusterTitles } from 'Constants/dataStore';
import i18n from 'i18nUtil';

import { getParentPath, getDirectoryNameFromPath } from './pathUtils';

const { t } = i18n;

export const buildBrowserSelectionDataFromFilerVolumeSites = (filerVolumeSites) => {
  const browserSelectionData = {};
  Object.values(filerVolumeSites).forEach((filerSites) => {
    filerSites.filersSelected?.forEach((filer) => {
      filer.volumes?.forEach((vol) => {
        browserSelectionData[vol.sourceId] = { isFullySelected: true, directories: {} };
      });
    });
    filerSites.sharesSelected?.forEach((partiallySelectedFiler) => {
      partiallySelectedFiler.volumes?.forEach((vol) => {
        const volumeDirectorySelections = {};
        vol.directories?.forEach((directoryPath) => {
          const parentPath = getParentPath(directoryPath);
          volumeDirectorySelections[parentPath] = {
            ...(volumeDirectorySelections[parentPath] || {}),
            [getDirectoryNameFromPath(directoryPath)]: true,
          };
        });
        browserSelectionData[vol.sourceId] = {
          isFullySelected: isEmpty(volumeDirectorySelections),
          directories: volumeDirectorySelections,
        };
      });
    });
  });
  return browserSelectionData;
};

// input = {
//   '/a/': { b: true, c: true },
//   '/a/d/': { e: true, f: true },
// };
// result = ["/a/b", "/a/c", "/a/d/e", "/a/d/f"]
export function convertSelectionTreeToArray(directorySelections) {
  return Object.entries(directorySelections).flatMap(([parentPath, children]) =>
    Object.keys(children).map((child) => `${parentPath}${child}`)
  );
}

export function getTotalVolumesFromSharesData(sharesData) {
  return sharesData.reduce((total, site) => {
    const volumeCount = Object.values(site.filerVolumeMap).reduce(
      (siteTotal, volumes) => siteTotal + volumes.length,
      0
    );
    return total + volumeCount;
  }, 0);
}

export const getFilerVolumeSitesFromSelectionData = (selectionData, sharesData) => {
  if (isEmpty(sharesData)) return {};
  const sourceIdToDirectorySelectionArr = Object.entries(selectionData).reduce((acc, [sourceId, selectionMap]) => {
    if (selectionMap.isFullySelected) {
      acc[sourceId] = [];
    } else if (!isEmpty(selectionMap.directories)) {
      acc[sourceId] = convertSelectionTreeToArray(selectionMap.directories);
    }
    return acc;
  }, {});

  const filerVolumesSites = {};

  sharesData.forEach((siteData) => {
    const fullySelectedFilers = [];
    const partiallySelectedFilers = [];

    Object.entries(siteData.filerVolumeMap).forEach(([filerId, filerVolumes]) => {
      const allSharesFullySelected = filerVolumes.every((volumeId) =>
        isEmptyArray(sourceIdToDirectorySelectionArr[volumeId])
      );

      if (allSharesFullySelected) {
        fullySelectedFilers.push({
          filerId,
          volumes: filerVolumes.map((volumeId) => ({
            sourceId: volumeId,
            directories: [],
          })),
        });
      } else {
        const volumes = filerVolumes.reduce((acc, volumeId) => {
          const directories = sourceIdToDirectorySelectionArr[volumeId];
          if (directories) {
            acc.push({ sourceId: volumeId, directories });
          }
          return acc;
        }, []);

        if (volumes.length) {
          partiallySelectedFilers.push({ filerId, volumes });
        }
      }
    });
    if (partiallySelectedFilers.length || fullySelectedFilers.length) {
      filerVolumesSites[siteData.siteId] = {
        siteId: siteData.siteId,
        siteName: siteData.siteName,
        sharesSelected: partiallySelectedFilers,
        filersSelected: fullySelectedFilers,
      };
    }
  });
  return filerVolumesSites;
};

export const getFilerAndSharesFromFilerVolumesSites = (filerVolumeSites, sharesData = [], includeMoveData = false) => {
  const siteIds = [];
  let filerIds = [];
  const sources = [];

  const siteToTotalFilersCountMap = sharesData.reduce((acc, { siteId, filerVolumeMap }) => {
    acc[siteId] = Object.keys(filerVolumeMap || {}).length;
    return acc;
  }, {});

  Object.entries(filerVolumeSites).forEach(([siteId, siteSelections]) => {
    const totalFilersInShare = siteToTotalFilersCountMap[siteId];
    const { sharesSelected = [], filersSelected = [] } = siteSelections;
    const filersSelectedInSite = filersSelected.map(({ filerId }) => filerId);

    if (filersSelectedInSite.length > 0 && filersSelectedInSite.length === totalFilersInShare) {
      siteIds.push(siteId);
    } else {
      filerIds = filerIds.concat(filersSelectedInSite);

      sharesSelected.forEach((partiallySelectedFiler) => {
        partiallySelectedFiler.volumes.forEach((volume) => {
          sources.push({
            sourceId: volume.sourceId,
            directories: volume.directories || [],
          });
        });
      });
    }
  });

  return { siteIds, filerIds, sources, includeMoveData };
};

// Note : this is not a perfect deepCompare, does not account for selecting then unselecting etc. Just basic checks like is no change made
// or if both are empty. Keeping it this way for potential perf reasons. If perfect comparison is needed, replacing jsonEqual with deepComparei18n should work
export function areFilerVolumeSitesEqual(filerVolumeSites = {}, referenceFilerVolumeSites = {}) {
  const browserSelectionData = buildBrowserSelectionDataFromFilerVolumeSites(filerVolumeSites);
  const referenceBrowserSelectionData = buildBrowserSelectionDataFromFilerVolumeSites(referenceFilerVolumeSites);
  return jsonEqual(browserSelectionData, referenceBrowserSelectionData);
}

export const getIconAndTooltipText = (entity) => {
  let icon;
  let tooltipText;
  switch (entity.type) {
    case DATASTORE_ENTITY_TYPES.SHARE:
      icon = 'ICON_SHARE';
      tooltipText = t('da_graphUtils_share');
      break;
    case DATASTORE_ENTITY_TYPES.SITE:
      icon = 'ICON_SITE';
      tooltipText = t('global_site');
      break;
    case DATASTORE_ENTITY_TYPES.CLUSTER:
      icon = 'ICON_CLUSTER';
      tooltipText = t('da_cluster');
      break;
    case DATASTORE_ENTITY_TYPES.FILER:
      icon = 'ICON_FILER';
      tooltipText = clusterTitles[entity.filerModel]?.filer || t('da_fileServer');
      break;
    default:
      break;
  }
  return { icon, tooltipText };
};
