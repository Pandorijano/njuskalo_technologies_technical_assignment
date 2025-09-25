import { test, expect } from '@playwright/test';
import { MarketplaceAdapter, type SiteId, type SearchCriteria } from '../pages/MarketplaceAdapter';
import rawCriteria from '../data/searchCriteria.json';
import { fetchAdDescription } from '../utils/listDescriptionFetcher';

const criteria = rawCriteria as Record<SiteId, SearchCriteria>;

function getSiteId(projectName: string): SiteId {
  if (projectName.includes('njuskalo')) return 'njuskalo';
  if (projectName.includes('bolha')) return 'bolha';
  throw new Error(`Unknown site in project: ${projectName}`);
}

test.describe('Marketplace car search', () => {
  test('search brand and filter by year + mileage', async ({ page }, testInfo) => {
    const siteId = getSiteId(testInfo.project.name);
    const c = criteria[siteId];  // search parameters
    const mp = new MarketplaceAdapter(page);  // mp = marketplace page

    // 1) Open home page and accept cookies
    await mp.gotoHome();
    await mp.acceptCookies();
    await expect(mp.search, 'Search box should be present on home page').toBeVisible();

    // 2) Input search term and verify suggestion dropdown box has appeared
    await mp.focusSearch();
    await mp.searchBrand(c.brand);
    await expect(mp.search).toHaveValue(c.brand);
    await expect(mp.searchResults, 'Suggestion box with options should appear').toBeVisible();

    // 3) Apply category filter in the suggestion box and select exact match 
    await mp.openCategoriesDropdown();
    await expect(mp.categoriesButton).toBeVisible();
    await expect(mp.brandOption(c.brand), 'Exact brand option should be present').toBeVisible();
    await mp.selectBrandCategory(c.brand);

    // 4) Input filters (set & verify values)
    await mp.setYearRange(c.minYear, c.maxYear);
    await expect(mp.yearMin).toHaveValue(String(c.minYear));
    await expect(mp.yearMax).toHaveValue(String(c.maxYear));

    await mp.setMaxMileage(c.maxMileage);
    await expect(mp.mileageMax).toHaveValue(String(c.maxMileage));

    // 5) Submit and check results from 5 standard ads 
    await expect(mp.submitButton).toBeEnabled();
    await mp.applyFilters();

    await mp.standardAdList.first().scrollIntoViewIfNeeded();

    await expect
    .poll(async () => mp.standardAd.count(), { message: 'Expected standard ads to load' })
    .toBeGreaterThan(0);

    const descriptions = await mp.getStandardAdDescriptions(5);

    for (let i = 0; i < descriptions.length; i++) {
      const { year, mileageKm } = fetchAdDescription(descriptions[i]);

      if (year !== undefined) {
        expect.soft(year, `Card #${i + 1} year`).toBeGreaterThanOrEqual(c.minYear);
        expect.soft(year, `Card #${i + 1} year`).toBeLessThanOrEqual(c.maxYear);
      }
      if (mileageKm !== undefined) {
        expect.soft(mileageKm, `Card #${i + 1} mileage`).toBeLessThanOrEqual(c.maxMileage);
      }
    }
  });
});
