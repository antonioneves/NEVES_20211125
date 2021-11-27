const express = require("express");
const routers = require("./routers");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const { sequelize } = require("./models");

const app = express();

app.use([
  express.json(),
  cors(),
  fileUpload({
    limits: { 
      fileSize: 200 * 1024 * 1024 // 200MB
    },
    createParentPath: true
  }),
]);
app.use("/", routers);

sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
});
