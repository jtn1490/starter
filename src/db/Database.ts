import mongoose from "mongoose";
import glob from "glob";
import { DatabaseRegistration } from "./mongodb";

export const database = ({ config, BASE_DIR }) => {
  const { mongodb } = config;
  const url = mongodb.url;
  const db = new DatabaseRegistration();
  const ext = BASE_DIR.includes("/dist") ? "js" : "ts";
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.set("useFindAndModify", false);

  glob
    .sync(`**/*.model.${ext}`, {
      cwd: `${BASE_DIR}/db/models`,
    })
    .map((filename) => {
      const modelName = filename
        .split("/")
        .slice(-1)[0]
        .split(".")
        .slice(-3)[0];
      console.log(`Registered model: ${modelName}`);
      return {
        name: modelName,
        schema: require(`${BASE_DIR}/db/models/${filename}`),
      };
    })
    .forEach(({ name, schema }) => {
      const Model = mongoose.model(name, schema);
      db.register(Model, name);
    });

  mongoose.connection
    .on("error", (error) => {
      throw error;
    })
    .once("open", () => {
      console.log(`MongoDB connected at: ${url}`);
    });

  return db;
};
