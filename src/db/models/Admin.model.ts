import { BaseUserSchema } from "../schemas";
import { mongoose } from "../mongoose";

const adminSchema = new mongoose.Schema(BaseUserSchema);

module.exports = adminSchema;
