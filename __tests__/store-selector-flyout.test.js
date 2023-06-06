const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');
const { resourceLimits } = require('worker_threads');
const url = 'http://www.canadiantire.ca';
const timeout = 10000
const violation_range = 1
let results = {}

const outputDir = './dist';
const componentName = 'canadiantire_store_flyout'
let testNumber = 1;
let screenshot_before = `${outputDir}/${componentName}_before`;
let screenshot_after = `${outputDir}/${componentName}_after`;
let output_filename = `${outputDir}/${componentName}.json`;

const interactiveElement = '.nl-primary-navigation-bar .nl-store-locator--section-button'
const inspectElement = '.nl-store-selector-flyout__container'

let generateOutputFileNames = () => {
    screenshot_before = `${outputDir}/${componentName}_before_${testNumber}.png`;
    screenshot_after = `${outputDir}/${componentName}_after_${testNumber}.png`;
    output_filename = `${outputDir}/${componentName}_${testNumber}.json`;
    testNumber++;
}

// CREATE OUTPUT DIR IF NOT EXISTS:
// Check if the directory exists
if (!fs.existsSync(outputDir)) {
// synchronously create a directory
  fs.mkdirSync(outputDir)
}

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ 
        headless: 'new',
        defaultViewport: {
            width: 1280, 
            height: 1024 
        }
    })
})

afterAll(async() => {
    await browser.close()
})

beforeEach(async() => {
    generateOutputFileNames()
    page = await browser.newPage()
    await page
        .goto(url, {waitUntil: ['domcontentloaded']})
        .catch((err) => console.log("error loading url", err));


    // await page.screenshot({ path: screenshot_before })
    
    // Open Store Flyout
    await page.waitForSelector(interactiveElement)
    await page.focus(interactiveElement)
    await page.click(interactiveElement)
    
    await page.waitForSelector(inspectElement)
    // Wait for List of Stores to Show
    await page.waitForSelector('.nl-store-selector-flyout__list-view')
})


async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


afterEach(async() => {
    // Write Report in a File
    fs.writeFile(output_filename, JSON.stringify(results, null, 2), (error) => {
        if (error) {
            console.log('An error has ocurred', error);
            return;
        }
    })
    await page.close();

    if (results && results.violations && results.violations.length > violation_range) {
        consoleResults();
    }
})


let consoleResults = () => {
    results.violations.forEach(violation => console.log(`TEST#: ${testNumber} || ${violation.id} ${violation.description}`))
}

describe("Store Flyout", () => {
    test("Open Flyout", async () => {
        await page.screenshot({ path: screenshot_after })

        results = await new AxePuppeteer(page)
            .include(inspectElement)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        expect(results.violations.length).toBeLessThan(violation_range);

    }, timeout);


    test("Insert text in address search box", async () => {
        await page.focus('#nl-store-locator-search-box')
        await page.keyboard.type('Toron')
        // await page.waitForTimeout(3000)
        // await page.$eval('#nl-store-locator-search-box', el => el.value="red")
        await page.waitForSelector('#scroll-list')
        await page.screenshot({ path: screenshot_after })

        results = await new AxePuppeteer(page)
            .include('.nl-autocomplete-container__search-result')
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        expect(results.violations.length).toBeLessThan(violation_range);
    }, timeout);



    test("View Store", async () => {

        // Another way to call the element
        await page.evaluate(() => {
            document.querySelector('.nl-store-selector-flyout__stores-list__item__view-stores-link').click()
        })
        await page.waitForSelector('.nl-store-details__text-content')
        await page.screenshot({ path: screenshot_after })

        results = await new AxePuppeteer(page)
            .include('.nl-store-details__text-content')
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        expect(results.violations.length).toBeLessThan(violation_range);
    }, timeout);
});


