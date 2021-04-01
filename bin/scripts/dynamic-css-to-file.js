const puppeteer = require('puppeteer');
const fs = require('fs');

const url = process.argv[2];
const stylesheetId = process.argv[3];

async function startBrowser(){
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }

    return browser;
}

async function getCssFromUrl( url, stylesheetId ) {
    const browser = await startBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    const inlineCss = await page.$eval(stylesheetId, el => el.innerText)
    await browser.close()

	fs.writeFileSync('assets/dynamic-css.css', inlineCss.replace(/(^[ \t]*\n)/gm, ""));
}

getCssFromUrl(url,stylesheetId);
