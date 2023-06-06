const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
// const argv = require('minimist')(process.argv.slice(2));

// CREATE OUTPUT DIR IF NOT EXISTS:
const outputDir = './dist';

// Check if the directory exists
if (!fs.existsSync(outputDir)) {
// synchronously create a directory
  fs.mkdirSync(outputDir)
}

const { program } = require('commander');
program
    .option('-u, --url <value>', 'Page URL to be scanned')
    .option('-c, --comp, --component  <value>', 'Component CSS selector to be analized. Example: ".nl-filters", "header", "footer"')
    .option('-o, --output <value>', 'Output file name')
    .name('a11y-test')
    .description('a11y-test is an accessibility Node.Js command for automated accessibility testing of websites and other HTML-based user interfaces.')
    .version('0.0.1');

program.parse(process.argv);
const options = program.opts();
if (!options.url) {
    console.log('No paramaters passed, please give a url')
    return false;
}


const url = options.url ? options.url : 'http://www.canadiantire.ca';
console.log(`Inspecting ${url}`);

let comp = options.comp ? options.comp : 'body'; 
console.log(`HTML/Component selector: "${options.comp}"`);

const output = options.output ? options.output : 'dist/results.json';
console.log(`Writing results in: ${output}`);

<<<<<<< HEAD
=======
(async () => {
    const browser = await puppeteer.launch({ headless: 'new'});
    const page = await browser.newPage();

    await page.goto(options.url);

    const results = await new AxePuppeteer(page)
        .include(options.comp)
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
>>>>>>> main


let writeResults = () => {
     fs.writeFile(output, JSON.stringify(results, null, 2), (error) => {
            if (error) {
                console.log('An error has ocurred', error);
                return;
            }
        })
}

// SPECIFIC TEST FROM HERE
// Testing Store Locator Button
// Selector: .nl-primary-navigation .nl-store-locator--section-button'
const screenshot = 'dist/canadiantire_store_flyout.png'
try {
    (async () => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto(url);
        await page.waitForSelector('.nl-primary-navigation-bar .nl-store-locator--section-button')
        await page.screenshot({ path: 'dist/before.png' })

        // Another way to call the element
        // await page.evaluate(() => {
        //     document.querySelector('button.nl-store-locator--section-button').click()
        // })

        await page.click('.nl-primary-navigation-bar .nl-store-locator--section-button')
        await page.waitForSelector('.nl-store-selector-flyout__container')
        await page.screenshot({ path: screenshot })



        // Execute Axe
        let secondElement = '.nl-store-selector-flyout__container'
        const results = await new AxePuppeteer(page)
            .include(secondElement)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        // Write Report in a File
        fs.writeFile(output, JSON.stringify(results, null, 2), (error) => {
            if (error) {
                console.log('An error has ocurred', error);
                return;
            }
        })

        console.log(`Found ${results.violations.length} violations`)
        await page.close();
        await browser.close();

        console.log('See screenshot: ' + screenshot)
    })()
} catch (err) {
    console.error(err)
}