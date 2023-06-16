const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const csv = require('fast-csv');
const fs = require('fs');



const processEbayJSON = catchAsync( async(req, res)=>{
  const searchTerm = 'Nike Air Jordan';
  const url  = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}`;
  try{
    const response = await axios.get(url);
    const html = await response.data;
    const $ = cheerio.load(html);
    const products = [];
    
    $('.s-item').each((index, element)=>{
      const title = $(element).find('.s-item__title').text();
      const price = $(element).find('.s-item__price').text();
      const imageUrl = $(element).find('div.s-item__image-wrapper > img').attr('src');
      const productLink = $(element).find('div.s-item__info.clearfix > a').attr('href');
      products.push({ title, price, imageUrl, productLink });
    })
    console.log("Products", products);
    // Create CSV
    const baseFolder = path.join(path.dirname(require.main.filename), "uploads/scrap-results/");
    var imgDest = `eBay-Scrap-Results.csv`;
    var fileName = path.join(baseFolder, imgDest);
    var ws = fs.createWriteStream(fileName);
    csv
      .write(products, {
        headers: true
      })
      .pipe(ws);
    ws.on('close', function(){
      res.json({ error: false, success: true, filename: imgDest, fileurl: `http://localhost:3000/uploads/scrap-results/${imgDest}`});
      return res.end();
    })  

    return;
  }catch(error){
    console.log('Error scrapping eBay:', error);
    res.json({
      success: false,
      error: error,
      products: []
    });
    return res.end();
  }
});

module.exports = {
  processEbayJSON,
}