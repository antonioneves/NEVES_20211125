const express = require("express");
const routers = require("./routers");

const { sequelize } = require("./models");

const app = express();

app.use(express.json());
app.use("/", routers);

sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
});
