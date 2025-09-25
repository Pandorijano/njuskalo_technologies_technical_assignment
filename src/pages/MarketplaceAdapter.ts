import type { Page, Locator } from '@playwright/test';

export type SiteId = 'njuskalo' | 'bolha';

export interface SearchCriteria {
  brand: string;
  minYear: number;
  maxYear: number;
  maxMileage: number;
}

export class MarketplaceAdapter {
  constructor(private page: Page) {}

  get acceptCookiesButton(): Locator { return this.page.locator('#didomi-notice-agree-button'); }
  get search(): Locator { return this.page.locator('#keywords'); }
  get searchResults(): Locator { return this.page.locator('#search-box-results'); }
  get categoriesButton(): Locator { return this.page.getByRole('button', { name: 'Kategorije' }); }
  get brandOption(): (brand: string) => Locator {
    return (brand: string) => this.page.getByRole('option', { name: brand, exact: true });
  }
  get yearMin(): Locator { return this.page.locator('#yearManufactured\\[min\\]'); }
  get yearMax(): Locator { return this.page.locator('#yearManufactured\\[max\\]'); }
  get mileageMax(): Locator { return this.page.locator('#mileage\\[max\\]'); }
  get submitButton(): Locator { return this.page.locator('#submitButton'); }
  get standardAdList() {
    return this.page.locator(
    'section.EntityList.EntityList--Standard.EntityList--Regular.EntityList--ListItemRegularAd'
  );
  }
  get standardAd() {
    return this.standardAdList.locator('ul.EntityList-items > li.EntityList-item');
  }


  async gotoHome(): Promise<void> {
    await this.page.goto('', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookies(opts?: { appearTimeoutMs?: number }): Promise<void> {
    const appearTimeout = opts?.appearTimeoutMs ?? 8000;

    try {
      await this.acceptCookiesButton.waitFor({ state:'visible', timeout: appearTimeout });
      await this.acceptCookiesButton.click();
    }
    catch {}
  }

  async focusSearch(): Promise<void> {
    await this.search.scrollIntoViewIfNeeded();
    await this.search.waitFor({ state: 'visible', timeout: 5000 });
    await this.search.click();
  }

  async searchBrand(brand: string): Promise<void> {
    await this.search.focus();
    await this.page.keyboard.type(brand, { delay: 20 });
  }

  async openCategoriesDropdown(): Promise<void> {
    await this.categoriesButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.categoriesButton.click();
  }

  async selectBrandCategory(brand: string): Promise<void> {
    const brandCategory = this.brandOption(brand);
    await this.searchResults.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await brandCategory.scrollIntoViewIfNeeded().catch(() => {});
    await brandCategory.click();
  }

  async setYearRange(min: number, max: number): Promise<void> {
    await this.yearMin.waitFor({ state: 'visible', timeout: 5000 });
    await this.yearMin.selectOption(String(min));
    await this.yearMax.selectOption(String(max));
  }

  async setMaxMileage(km: number): Promise<void> {
    await this.mileageMax.waitFor({ state: 'visible', timeout: 5000 });
    await this.mileageMax.fill(String(km));
  }

  async applyFilters(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.submitButton.click();
  }

  getStandardAdDescription(index: number) {
  return this.standardAd.nth(index).locator('.entity-description-main');
  }

  async getStandardAdDescriptions(adCount: number): Promise<string[]> {
    const count = await this.standardAd.count();
    const limit = Math.min(count, adCount);
    const out: string[] = [];
    for (let i = 0; i < limit; i++) {
        const descLoc = this.getStandardAdDescription(i);
        const text =
        (await descLoc.count()) > 0
            ? (await descLoc.innerText()).trim()
            : ((await this.standardAd.nth(i).textContent()) ?? '');
        out.push(text);
    }
    return out;
  }
}