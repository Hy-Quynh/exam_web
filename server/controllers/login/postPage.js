const cheerio = require("cheerio");
const fetch = require("node-fetch");

async function postPage(url, postData, cookie) {
  try {
    const formBody = Object.keys(postData)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(postData[key])
      )
      .join("&");

    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": formBody.length,
    };

    if (cookie) headers.Cookie = cookie;
    let postRes = await fetch(url, {
      method: "POST",
      headers: headers,
      body: formBody,
    });

    const newCookie = postRes.headers.raw()["set-cookie"];
    const postHTML = await postRes.text();
    const dom = cheerio.load(postHTML);

    return {
      cookie: newCookie,
      dom: dom,
      viewState: dom("#__VIEWSTATE")[0].attribs.value,
      viewGenerator: dom("#__VIEWSTATEGENERATOR")[0].attribs.value,
    };
  } catch (error) {
    return {
      error: true,
      message: error.toString(),
    };
  }
}

module.exports = postPage;
