// middleware/security.js
const { sanitizeUser } = require('../utils/authUtils');

function filterAuthData() {
  return (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      if (data?.user) {
        data.user = sanitizeUser(data.user);
      }
      originalSend.call(this, data);
    };
    next();
  };
}

module.exports = {
  filterAuthData,
};
