# Njuškalo Technologies technical assignment

## Setup

1. Clone the repo

```sh
git clone https://github.com/Pandorijano/njuskalo_technologies_assignment.git
```

2. Move to the directory

```sh
cd njuskalo_technology_technical_assignment
```

3. Install packages

```sh
npm install
```

## How it works

### Sites and browsers matrix 
 - Sites: 
    - [Njuškalo](https://www.njuskalo.hr)
    - [Bolha](https://www.bolha.com)
 - Browsers: 
    - Chrome (headed)
    - Firefox, Safari (headless)

### Data 
 - `src/data/searchCriteria.json` contains search and filter input per site
 - `tsconfig.json` enables `resolveJsonModule` so the test can import JSON directly

 ### Adapter page and test
 - `src/pages/MarketplaceAdapter.ts` contains page locators and methods for both sites
 - `src/tests/search-cars.spec.ts` uses the `MarketplaceAdapter.ts` methods to navigate and checks the results 

 ### Known issues/obstacles
 - Ad on Njuškalo home page pushing content: scroll helpers bring the search box into viewport even if the page shifts
 - Suggestion box not showing up if search term is filled in: `keyboard.type()` used instead of `fill()` to slow down the input
 - Suggestion box not showing up in chrome headless mode: chrome runs the test in headed mode
 - CAPTCHA (Bolha): too many requests at the same time trigger the captcha on the production site, impossible to bypass, to handle this the number of workers is set to 2 although it does not always help


## Project Structure

The project is structured using the page object pattern.

- `root`: Contains config files
- `src/data`: Contains test data per site used for search and filters
- `src/pages`: Contains a single adapter page for both sites with locators and methods
- `src/tests`: Contains a single test which works with both sites
- `src/utils`: Contains methods used to scrape year and milage from the filtered ads 

## Run tests

By default, tests are run both sites on all browsers using 2 workers to avoid chapta trigger, Chrome is run in headed mode while Firefox and Safari are run in headless mode.
The configuration can be adjusted in the `playwright.config` file.

### Command line

#### Run all (matrix)

```sh
npx playwright test
```

#### Run by site

```sh
npx playwright test --project="njuskalo-*"
npx playwright test --project="bolha-*"
```

#### Run by browser

```sh
npx playwright test --project="*-Desktop Chrome"
npx playwright test --project="*-Desktop Firefox"
npx playwright test --project="*-Desktop Safari"
```

### Force single worker

```sh
npx playwright test --project="bolha-*" --workers=1
```


## Test reports

### HTML report

After the test run is done, an HTML report is generated.
By default, the report opens automatically in case of failures.
