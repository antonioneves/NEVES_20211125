const express = require("express");
const routers = require("./routers");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { exec } = require("child_process");

const { sequelize } = require("./models");

const app = express();

app.use([
  express.json(),
  cors(),
  fileUpload({
    limits: {
      fileSize: 200 * 1024 * 1024, // 200MB
    },
    createParentPath: true,
  }),
]);
app.use("/", routers);

sequelize.sync({ force: false }).then(() => {
  exec("npm run seed-db", (err, stdout, stderr) => {
    if (err)
      return console.log("Seeds already applied");
    if (stderr)
      return console.log(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
  });
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
});
