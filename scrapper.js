const puppeteer = require('puppeteer');
const $ = require('cheerio');
let productDetails = {};

//let bookingUrl = 'https://www.amazon.in/Samsung-Galaxy-Storage-Additional-Exchange/dp/B086KGPM5G';
async function configureBrowser(url){
    const browser = await puppeteer.launch({ headless: true , timeout : 0});
    const page = await browser.newPage();
    page.setDefaultTimeout(0);
    await page.goto(url);
    return page;
}


async function getProductDetails(page){
    try{
        await page.reload();
        let html = await page.evaluate(() => document.body.innerHTML);
        $('#productTitle',html).each((i,element) => {
            let $element = $(element);
            let productName = $element.text().trim();
            productDetails['productName'] = productName;
        });
        if($('#priceblock_ourprice',html).prevObject['0'].type === 'root'){
            console.log($('#priceblock_ourprice',html).prevObject['0'].type);
            $('#priceblock_ourprice',html).each((i,element) => {
                let $element = $(element);
                let productPrice = $element.text();
                productDetails['productPrice'] = productPrice;
            });
        }    
        else{
            console.log($('#priceblock_dealprice',html).prevObject['0'].type);
            $('#priceblock_dealprice',html).each((i,element) => {
                let $element = $(element);
                let productPrice = $element.text();
                productDetails['productPrice'] = productPrice;
            });
        }
        console.log($('#landingImage',html).attr('src'));
        $('#landingImage',html).each((i,element) => {
            let $element = $(element);
            let imgUrl = $element.attr('src');
            productDetails['img-src'] = imgUrl;
        });
        // productDetails['img-src'] = $('#landingImage').attr(src);
        //console.log(productDetails);
        return productDetails;
    }catch(e){
        console.log('error loading the page!!');
    }
}

// async function displayDetails(page){
//     let productDetails = await getProductDetails(page);
//     console.log(productDetails['productName']);
//     console.log(productDetails['productPrice']);
// }

async function monitorPrice(url){
    let page = await configureBrowser(url);
    return await getProductDetails(page);
}

//monitorPrice();

module.exports = {
    monitorPrice
};