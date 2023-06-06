

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');
const { resourceLimits } = require('worker_threads');
const url = 'https://www.canadiantire.ca/en/cat/tools-hardware/power-tools/saws-DC0002013.html';
const timeout = 30000
const violation_range = 1
let results = {}

const outputDir = './dist';
const componentName = 'plp'
let testNumber = 1;
let screenshot_before = `${outputDir}/${componentName}_before`;
let screenshot_after = `${outputDir}/${componentName}_after`;
let output_filename = `${outputDir}/${componentName}.json`;

const interactiveElement = 'button.custom-dropdown'
const inspectElement = '#nl-filters'

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
        devtools: false,
        defaultViewport: {
            width: 1280, 
            height: 1024 
        },
        args: ['--disable-features=site-per-process'] 
    })
})

afterAll(async() => {
    await browser.close()
})

beforeEach(async() => {
    generateOutputFileNames()
    page = await browser.newPage()
    await page.goto(url, { waitUntil: ['domcontentloaded'] });
})

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

describe(componentName, () => {
    test("Set Focus on categories filter", async () => {
        const interactiveElement = '#productCategory button.custom-dropdown'
        const inspectElement = '#productCategory'

        // OPEN MODAL
        await page.waitForSelector(interactiveElement)
        await page.focus(interactiveElement)

        results = await new AxePuppeteer(page)
            .include(inspectElement)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()
        await page.screenshot({ path: screenshot_after })
        expect(results.violations.length).toBeLessThan(violation_range);

    }, timeout);

    test("Open Categories", async () => {
        const interactiveElement = '#productCategory button.custom-dropdown'
        const inspectElement = '#productCategory'

        // OPEN MODAL
        await page.waitForSelector(interactiveElement)
        await page.focus(interactiveElement)
        await page.click(interactiveElement)
        await page.waitForSelector('#productCategory .custom-dropdown-panel--open')
        await page.evaluate(() => document.querySelector('#nl-filters').scrollIntoView());

        results = await new AxePuppeteer(page)
            .include(inspectElement)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()
        await page.screenshot({ path: screenshot_after })
        expect(results.violations.length).toBeLessThan(violation_range);

    }, timeout);




    test("Open categories filter with keyboard [ENTER]", async () => {
        const interactiveElement = '#productCategory button.custom-dropdown'
        const inspectElement = '#productCategory'

        // OPEN MODAL
        await page.waitForSelector(interactiveElement)
        await page.focus(interactiveElement)
        await page.keyboard.press('Enter')
        await page.waitForSelector('.custom-dropdown-panel--open')
        const elem = await page.$('.custom-dropdown-panel--open')

        expect(elem).toBeTruthy();
        await page.screenshot({ path: screenshot_after })


    }, timeout);

    test("Open categories filter with keyboard [SPACE]", async () => {
        const interactiveElement = '#productCategory button.custom-dropdown'
        const inspectElement = '#productCategory'

        // OPEN MODAL
        await page.waitForSelector(interactiveElement)
        await page.focus(interactiveElement)
        await page.keyboard.press('Space')
        // await page.waitForSelector('.custom-dropdown-panel--open')
        const elem = await page.$('.custom-dropdown-panel--open')
        expect(elem).toBeTruthy();
        await page.screenshot({ path: screenshot_after })
    }, timeout);


    // test("Set focus on second element via keyboard ", async () => {
    //     const interactiveElement = '#productCategory button.custom-dropdown'
    //     const inspectElement = '#productCategory'

    //     // OPEN MODAL
    //     await page.waitForSelector(interactiveElement)
    //     await page.focus(interactiveElement)
    //     await page.keyboard.press('Enter')
    //     await page.keyboard.press('Tab')
    //     await page.keyboard.press('Tab')
    //     await page.screenshot({ path: screenshot_after })

    //     const elem = await page.$('.custom-dropdown-panel--open ul li:nth-child(2) a')
    //     expect(document.activeElement).toBe(elem);
        

    // }, timeout);


});


