import fs from "fs";
import path from "path";

const env = process.env.NODE_ENV;
let config;

config = fs.readFileSync(
  path.join(__dirname, `../configs/config.${env}.json`),
  "utf-8"
);

if (typeof config === "string") {
  config = JSON.parse(config);
}

module.exports = config;
