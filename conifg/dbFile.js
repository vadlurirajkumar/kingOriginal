const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb+srv://test:test123@delivery.8djvtwc.mongodb.net/users")
  .then(() => {
    console.log(`db connected`);
  })
  .catch((err) => {
    console.log(err);
  });
