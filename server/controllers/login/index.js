const { account } = require('../../constants');
const login = require('./login');

module.exports = async (req, res) => {
  const { username, password } = req.body;

  //dummy account student
  if (username === account.studentAccount.username) {
    if (password === account.studentAccount.password) {
      return res.json({
        type: 'STUDENT',
        name: 'Dummy Account',
        username: account.studentAccount.username,
        password: account.studentAccount.password,
      });
    } else {
      return res.json({
        error: true,
        message: 'Sai mật khẩu',
      });
    }
  }

  if (username === account.teacherAccount.username) {
    if (password === account.teacherAccount.password) {
      return res.json({
        type: 'TEACHER',
        name: 'Dummy Account',
        username: account.teacherAccount.username,
        password: account.teacherAccount.password,
      });
    } else {
      return res.json({
        error: true,
        message: 'Sai mật khẩu',
      });
    }
  }

  const result = await login(username, password);
  //Neu login loi: result.error = true
  //Neu login thanh cong result.error = false
  res.json(result);
};
