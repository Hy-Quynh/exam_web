const cheerio = require("cheerio");
const crackCaptcha = require("./crackCaptcha");
const fetch = require("node-fetch");

async function getPage(url) {
  try {
    const firstRes = await fetch(url);
    const firstPage = await firstRes.text();

    const cookie = firstRes.headers.raw()["set-cookie"];
    const firstDom = cheerio.load(firstPage);

    const captcha = await crackCaptcha(firstDom, cookie, url);

    if (captcha && captcha.error) return captcha;

    if (captcha && !captcha.error) {
      const secondRes = await fetch(url, {
        method: "GET",
        headers: {
          Cookie: cookie,
        },
      });

      const secondPage = await secondRes.text();
      const secondDOM = cheerio.load(secondPage);

      return {
        cookie: cookie,
        dom: secondDOM,
        viewState: secondDOM("#__VIEWSTATE")[0].attribs.value,
        viewGenerator: secondDOM("#__VIEWSTATEGENERATOR")[0].attribs.value,
      };
    }

    return {
      cookie: cookie,
      dom: firstDom,
      viewState: firstDom("#__VIEWSTATE")[0].attribs.value,
      viewGenerator: firstDom("#__VIEWSTATEGENERATOR")[0].attribs.value,
    };
  } catch (error) {
    return {
      error: true,
      message: error.toString(),
    };
  }
}

module.exports = getPage;
