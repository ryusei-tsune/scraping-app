const express = require('express');
const router = express.Router();

const axios = require('axios');
const puppeteer = require('puppeteer');

router.get('/scraping', async (req, res, next) => {
    console.log("a")
    const browser = await puppeteer.launch();
    console.log("b")
    const page = await browser.newPage();
    console.log("c")
    res.status(200).json({ ok: true, statusText: 'ok.' });
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