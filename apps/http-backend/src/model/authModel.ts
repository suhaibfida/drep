import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    maxLength: 15,
    required: true,
  },
  email: {
    type: String,
    required: true,
    maxLength: 3,
    minLength: 10,
  },
  password: {
    type: String,
    required: true,
    maxLength: 3,
    minLength: 15,
  },
});
const user = mongoose.model("User", userSchema);
export { user };
