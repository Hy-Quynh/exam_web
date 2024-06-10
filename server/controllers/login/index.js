const login = require("./login");

module.exports = async (req, res) => {
  const { username, password } = req.body;
  const result = await login(username, password);
  //Neu login loi: result.error = true
  //Neu login thanh cong result.error = false
  res.json(result);
};
