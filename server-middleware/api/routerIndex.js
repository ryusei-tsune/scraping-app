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
            datalist.push({ URL: url, Bookname: bookName, Author: author, Publisher: publisher, Existing: existing })
        });
        return datalist;
    });
    console.log(resultArray);
    res.status(200).json(resultArray);
    await browser.close();
})
router.post('/detail-information', async (req, res, next) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    //var url = "https://webcat.lib.okayama-u.ac.jp/opac/search?q=Julia";
    var url = "https://webcat.lib.okayama-u.ac.jp" + req.body.url;
    console.log(url)
    await page.goto(url, {
        waitUntil: "networkidle0",
    });
    var resultInfo = await page.evaluate(() => {
        const datalist = [];
        var i = 0;
        while (1){
            const result = document.getElementById("lid_volume_td_0_st_" + i);
            if (!result){
                break;
            }
            const existing = result.getElementsByTagName('p')[0].innerText;
            if (existing == "在庫中"){
                const floorResult = document.getElementById("lid_volume_td_0_lo_" + i);
                const locationResult= document.getElementById("lid_volume_td_0_ca_" + i);
                
                const floor = floorResult.getElementsByTagName('a')[0].innerText;
                const locations = locationResult.getElementsByTagName('li');//3つ値が存在
                var location = ""
                for (let j = 0; j < locations.length; j++){
                    location += locations[j].innerText + "/" 
                }
                datalist.push({ Floor: floor, Location: location })
            }
            i++;
        }
        return datalist;
    });
    console.log(resultInfo[0]);
    res.status(200).json(resultInfo[0]);
    await browser.close();
})

module.exports = router