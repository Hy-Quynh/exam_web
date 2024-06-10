const postPage = require("./postPage");
const getTextOfNode = require("./getTextOfNode");

function getCaptcha(page) {
  const captchaNode = page("#ctl00_ContentPlaceHolder1_ctl00_lblCapcha")[0];
  return captchaNode ? getTextOfNode(captchaNode) : false;
}

async function crackCaptcha(page, cookie, url) {
  const captcha = getCaptcha(page);

  if (captcha) {
    const postData = {
      __EVENTTARGET: "",
      __EVENTARGUMENT: "",
      __VIEWSTATE: page("#__VIEWSTATE")[0].attribs.value,
      __VIEWSTATEGENERATOR: page("#__VIEWSTATEGENERATOR")[0].attribs.value,
      ctl00$ContentPlaceHolder1$ctl00$txtCaptcha: captcha,
      ctl00$ContentPlaceHolder1$ctl00$btnXacNhan: "Vào website",
    };

    const postResult = await postPage(url, postData, cookie);
    if (postResult.error) return postResult;
    const { dom } = postResult;

    const newCaptcha = getCaptcha(dom);

    if (newCaptcha)
      return {
        error: true,
        message:
          "Hệ thống đào tạo đang yêu cầu xác thực captcha. Thử lại lần sau!",
      };

    return {
      cookie: cookie,
      viewState: dom("#__VIEWSTATE")[0].attribs.value,
      viewGenerator: dom("#__VIEWSTATEGENERATOR")[0].attribs.value,
    };
  }

  return false;
}

module.exports = crackCaptcha;
