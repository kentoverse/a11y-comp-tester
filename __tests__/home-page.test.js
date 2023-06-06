const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const fs = require('fs');
const { resourceLimits } = require('worker_threads');
const url = 'http://www.canadiantire.ca';
const timeout = 30000
const violation_range = 1
let results = {}

const outputDir = './dist';
const componentName = 'homepage'
let testNumber = 1;
let screenshot_before = `${outputDir}/${componentName}_before`;
let screenshot_after = `${outputDir}/${componentName}_after`;
let output_filename = `${outputDir}/${componentName}.json`;

const interactiveElement = '#email-signup'
const inspectElement = '.gigya-subscribe-with-email-form'

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

    // OPEN MODAL
    await page.waitForSelector(interactiveElement)
    await page.focus(interactiveElement)
    await page.click(interactiveElement)
    await page.waitForSelector('#gigya-textbox-email')

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

describe("Homepage", () => {
    test("Open Sign Up Modal", async () => {
        results = await new AxePuppeteer(page)
            .include(inspectElement)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()
        await page.screenshot({ path: screenshot_after })
        expect(results.violations.length).toBeLessThan(violation_range);

    }, timeout);


    test("Submit Sign Up Modal with all fields empty", async () => {
        // Submit Form
        let submitBtn = '.gigya-subscribe-with-email-form input[type="submit"]';
        await page.evaluate(() => document.querySelector('.gigya-subscribe-with-email-form input[type="submit"]').scrollIntoView());
        await page.focus(submitBtn)
        await page.click(submitBtn)

        // Run Axe
        results = await new AxePuppeteer(page)
            .include(inspectElement)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()
        await page.screenshot({ path: screenshot_after })

        expect(results.violations.length).toBeLessThan(violation_range);
    }, timeout);



    test("Submit Sign Up Modal entering wrong data in Email Form", async () => {
        // Enter Wrong Email
        await page.focus('#gigya-textbox-email')
        await page.keyboard.type('notAnEmail')

        // Submit Form
        let submitBtn = '.gigya-subscribe-with-email-form input[type="submit"]';
        await page.evaluate(() => document.querySelector('.gigya-subscribe-with-email-form input[type="submit"]').scrollIntoView());
        await page.focus(submitBtn)
        await page.screenshot({ path: screenshot_after })

        // Run Axe
        results = await new AxePuppeteer(page)
            .include(inspectElement)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        expect(results.violations.length).toBeLessThan(violation_range);
    }, timeout);
});


