const mongoose = require("mongoose");
const connection = mongoose.connect("mongodb+srv://sitansugcelt:smandal@cluster0.x1yj8ov.mongodb.net/mocknine?retryWrites=true&w=majority");
module.exports = {
  connection,
};
