const getPage = require("./getPage");
const postPage = require("./postPage");
const getTextOfNode = require("./getTextOfNode");

function parseLoginResult($) {
  const userNode = $("#ctl00_Header1_Logout1_lblNguoiDung")[0];

  const name = userNode ? getTextOfNode(userNode) : false;

  if (name && name.trim() !== "Chào bạn") return name;
  else {
    const errorNode = $(
      "#ctl00_ContentPlaceHolder1_ctl00_ucDangNhap_lblError"
    )[0];

    const errorMessage = errorNode ? getTextOfNode(errorNode) : false;
    return {
      error: true,
      message: errorMessage ? errorMessage : "Vui lòng thử login lại",
    };
  }
}

async function login(username, password) {
  const getResult = await getPage("http://daotao.vnua.edu.vn/");
  if (getResult.error) return getResult;
  const { cookie, viewState, viewGenerator } = getResult;
  const postData = {
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE: viewState,
    __VIEWSTATEGENERATOR: viewGenerator,
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: username,
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: password,
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: "Đăng Nhập",
  };
  const postResult = await postPage(
    "http://daotao.vnua.edu.vn/default.aspx",
    postData,
    cookie
  );

  if (postResult.error) return postResult;

  const { dom } = postResult;

  const name = parseLoginResult(dom);

  if (name.error) return name;

  return {
    type: name?.includes('Chào bạn') ? 'STUDENT' : 'TEACHER',
    name: name
      .replace("Chào Giảng viên ", "")
      .replace("Chào bạn ", "")
      .replace(/\(\d{6}\)/gi, "")
      .trim(),
    username: username,
    password: password,
    cookie: cookie,
    lastTry: Date.now(),
  };
}

module.exports = login;
