const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(400).send({ msg: `Token not found` });
  } else {
    try {
      const decoded = jwt.verify(token, "sitansu");
      console.log(decoded);
      req.body.userID = decoded.userid;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  }
};

module.exports = authentication;
