import { ReserveCacheError, restoreCache, saveCache } from '@actions/cache';
import { endGroup, info, startGroup, warning } from '@actions/core';

const cacheKey = 'sonar-cache';
const paths = ['/home/runner/.sonar/cache'];

export const cachePlugins = async (): Promise<void> => {
  startGroup('Caching plugins...');

  try {
    const cacheId = await saveCache(paths, cacheKey);
    info(`Cached plugins with id: ${cacheId}`);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      if (error instanceof ReserveCacheError) {
        warning(`Failed to reserve cache with key ${cacheKey}. Error: ${error.message}`);
      } else if (error instanceof Error) {
        warning(`An error occurred while caching plugins. Error: ${error.message}`);
      }
    } else {
      warning('An error occurred while caching plugins.');
    }
  }

  endGroup();
};

export const restoreCachedPlugins = async (): Promise<void> => {
  startGroup('Restoring cached plugins...');

  const restoredCacheKey = await restoreCache(paths, cacheKey);
  info(`Restored plugins with key: ${restoredCacheKey}`);

  endGroup();
};
