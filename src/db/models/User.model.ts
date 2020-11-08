import { BaseUserSchema } from "../schemas";
import { mongoose } from "../mongoose";

const userSchema = new mongoose.Schema(BaseUserSchema);

module.exports = userSchema;
