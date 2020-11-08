export const BaseUserSchema = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  pass_salt: {
    type: String,
    required: true,
  },
  pass_hash: {
    type: String,
    required: true,
  },
  accountSetup: {
    type: Boolean,
    default: false,
  },
};
