import mongoose from "mongoose";

class ModelInstance {
  model: mongoose.Model;

  constructor(model: mongoose.Model) {
    this.model = model;
  }

  async findOne(query: object) {
    return this.model.findOne(query);
  }

  find(query: object) {
    return this.model.find(query);
  }

  create(body: object) {
    return this.model.create(body);
  }

  updateOne(query: object, body: object) {
    return this.model.findOne(query, body);
  }

  updateMany(query: object, body: object) {
    return this.model.updateMany(query, body, { multi: true });
  }

  deleteOne(query: object) {
    return this.model.deleteOne({ query });
  }

  deleteMany(query: object) {
    return this.model.deleteMany({ query });
  }
}

export class DatabaseRegistration {
  [index: string]: any;
  register(model, name: string) {
    this[name] = new ModelInstance(model);
  }
}
