const express = require('express');
const router = express.Router();

const axios = require('axios');
const puppeteer = require('puppeteer');

router.post('/scraping', async (req, res, next) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    //var url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=Julia";
    var url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=" + req.body.name;
    console.log(url)
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
                    if (dtName.includes("著者名")) {
                        author = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                    else if (dtName.includes("出版")) {
                        publisher = dTags[1].getElementsByTagName('span')[0].innerText;
                    }
                    else if (dtName.includes("状況")) {
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
router.get('/scraping-test', async (req, res, next) => {
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        var url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=Julia";
        //var url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=" + req.body.name;
        console.log(url)
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
                        if (dtName.includes("著者名")) {
                            author = dTags[1].getElementsByTagName('span')[0].innerText;
                        }
                        else if (dtName.includes("出版")) {
                            publisher = dTags[1].getElementsByTagName('span')[0].innerText;
                        }
                        else if (dtName.includes("状況")) {
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
    } catch {
        res.status(400)

    }

})

module.exports = router