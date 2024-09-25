# a11y-test
## React Component Accessibilty Testers using Web Crawler

a11y-test is an accessibility Node.Js command for automated accessibility testing of websites and other HTML-based user interfaces.

## Getting started
First download the package
`git clone https://github.com/HectorOsborneRodriguez/a11y-automated-comp-test`

Now install all the packages 
`npm install`

Run your  tests `npm run jest -t home` or `npm run jest -t plp` or `npm run jest -t flyout`


## Output
Running test scripts will  generate 1 x screenshot images and 1x `.json` file for eacth test inside the `dist` folder



## Using Jest
Run a single test scenario (for example: Store Flyout)
`npx jest -t "Store Flyout"`

Run a single test scenario (for example: PLP page)
`npx jest -t plp`
or
`npx jest -t homepage`

Run a jest file
`npx jest __tests__/store-selector-flyout.test.js`

Run all tests  
`npm run jest`




## Using Commander (command line with prompts) [Work in Progress]
Alternatevily you can also run the command line with options
`node a11y-test.js`

To get help on the command use
`node a11y-test.js --help`

Example of a command line
`node  a11y-test.js -u http://www.canadiantire.ca -c footer -o dist/result.json`

### Example usage
`node a11y-test.js -u "http://www.canadiantire.ca" -c "footer" -o footer.json`

### Usage
Options:  
`  -u, --url <value>`                 Page URL to be scanned  
`  -c, --comp, --component  <value>`  Component CSS selector to be analized. Example: ".nl-filters", "header", "footer"  
`  -o, --output <value>`              Output file name  
`  -V, --version`                     output the version number  
`  -h, --help`                        display help for command  



## Documentation
- [Jest Timeout Error](https://bobbyhadz.com/blog/jest-exceeded-timeout-of-5000-ms-for-test)
- [Jest for React](https://aaron-kt-berry.medium.com/a11y-testing-with-axe-core-eb074744e073)
