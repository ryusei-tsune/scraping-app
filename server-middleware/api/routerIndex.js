const express = require('express');
const router = express.Router();

const axios = require('axios');
const puppeteer = require('puppeteer');

router.get('/scraping', async (req, res, next) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var url = "https://webcat.lib.okayama-u.ac.jp/opac/volume/1293409?category-book=1&target=local"
    await page.goto(url, {
        waitUntil: "networkidle2",
    });
    
    var resultText = [];
    var resultArray = await page.evaluate(() => {
        const datalist = [];
        const resultlist = document.getElementsByTagName('p');
        Array.prototype.forEach.call(resultlist, (element) => {
            datalist.push(element.innerText);
        });
        return datalist;
    })
    console.log(resultArray);
    // let resultSelectors = await page.$('p');
    //  for (let i = 0; i < resultArray.length; i++) {
    //      console.log(resultArray[i])
    //  }
    // console.log(resultText)
    res.status(200).json({ ok: true, statusText: 'ok.', body: resultArray});
    await browser.close();
})
router.get('/matsumoto', async (req, res, next) => {
    try {
        const { data } = await axios.get('http://linkdata.org/api/1/rdf1s5367i/kuriningu_202109.csv')
        const csvData = data.split('\n').map(line => line.split(',').map(val => val.trim()))
        res.status(200).json({ ok: true, statusText: 'ok.', body: csvData })
    } catch (err) {
        res.status(400).json({ ok: false, statusText: err?.message || 'Unknown Error' })
    }
})

module.exports = router