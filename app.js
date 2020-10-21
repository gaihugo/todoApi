const morgan = require("morgan");
const express = require("express");
const app = express();
const port = 3000;

app.use(morgan("dev"));

app.use(express.static("public"));

app.listen(port);
