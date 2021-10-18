const express = require('express');
const router = express.Router();

const axios = require('axios');
const puppeteer = require('puppeteer');

router.get('/scraping', async (req, res, next) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //var url = "https://webcat.lib.okayama-u.ac.jp/opac/volume/1293409?category-book=1&target=local"
    //var url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=%E5%AB%8C%E3%82%8F%E3%82%8C%E3%82%8B%E5%8B%87%E6%B0%97"
    var url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=Julia"
    await page.goto(url, {
        waitUntil: "networkidle0",
    });

    var resultArray = await page.evaluate(() => {
        const datalist = [];
        const result = document.getElementById('resultCards');
        const resultlist = result.children;
        Array.from(resultlist).forEach((book) => {
            //var eachBook = book.getElementsByClassName('c_searchCard_topWrap')[0];
            var elements = book.getElementsByClassName('informationArea')[0].children;
            var url = "";
            var bookName = ""
            var author = "";
            var publisher = "";
            var existing = "";
            Array.from(elements).forEach((element, index) => {
                if (index == 0) {
                    var name = element.getElementsByTagName('a')[0]
                    url = name.getAttribute('href');
                    bookName = name.innerText;
                }
                else {
                    var dTags = element.children;
                    var dtName = dTags[0].innerText;
                    if (dtName.includes("著者名")){
                        author = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                    else if(dtName.includes("出版")){
                        publisher = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                    else if (dtName.includes("状況")){
                        existing = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                }
            });
            datalist.push({ URL: url, bookname: bookName, Author: author, Publisher: publisher, Existing: existing })
        });
        return datalist;
    });
    console.log(resultArray);
    res.status(200).json(resultArray);
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