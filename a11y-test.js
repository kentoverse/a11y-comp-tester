const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const { writeFile } = require('fs');

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
const url = (options.url ? `Inspecting: ${options.url}` : 'Page URL has not been provided.');
console.log(url);

const comp = (options.comp ? `HTML/Component selector: "${options.comp}"` : 'HTML/CSS Component selector has not been provided.');
console.log(comp);


if (!options.url || !options.comp) return false;

const output = options.output ? options.output : 'results.json';
console.log(`Writing results in: ${output}`);

(async () => {
    const browser = await puppeteer.launch({ headless: 'new'});
    const page = await browser.newPage();

    await page.goto(options.url);

    const results = await new AxePuppeteer(page)
        .include(options.comp)
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();


    writeFile(output, JSON.stringify(results, null, 2), (error) => {
        if (error) {
            console.log('An error has ocurred', error);
            return;
        }
    })
    // console.log(results);

    await page.close();
    await browser.close();
})();