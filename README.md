# a11y-test

a11y-test is an accessibility Node.Js command for automated accessibility testing of websites and other HTML-based user interfaces.

## Getting started
First download the package
`git clone https://innersource.accenture.com/users/hector.a.rodriguez/repos/a11y-test/browse`

Now install all the packages 
`npm install`

Finally run the command line
`npm a11y-test.js`

To get help on the command use
`npm a11y-test.js --help`

## Example usage
`node a11y-test.js -u "http://www.canadiantire.ca" -c "footer" -o footer.json`


## Usage
Options:  
`  -u, --url <value>`                 Page URL to be scanned  
`  -c, --comp, --component  <value>`  Component CSS selector to be analized. Example: ".nl-filters", "header", "footer"  
`  -o, --output <value>`              Output file name  
`  -V, --version`                     output the version number  
`  -h, --help`                        display help for command  