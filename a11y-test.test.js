

describe('Home Page', () => {
  beforeAll(async () => {
    await page.goto('https://www.canadiantire.ca');
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  });

  afterAll(async() => {
    await page.close();
  })

});


describe('PDP Page', async () => {
  beforeAll(async ()=> {
    await page.goto('https://www.canadiantire.ca/en/pdp/mastercraft-heavy-duty-stackable-storage-box-with-lid-102-l-black-blue-1426045p.html?rq=store+promotion#srp');
  });

  it('Test click ship to home', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  })

  afterAll(async() => {
    await page.close();
  })
  
})

// const puppeteer = require('puppeteer');

// describe('Google', () => {
//   beforeAll(async () => {
//     const browser = await puppeteer.launch({ headless: 'new' });
//     const page = await browser.newPage();

//     await page.goto('https://google.com');
//   });


//   it('should be titled "Google"', async () => {
//     await expect(page.title()).resolves.toMatch('Google');
//   });

//   async () => {
//     await page.close();
//     await browser.close();
//   }
// });