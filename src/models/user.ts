import mongoose from 'mongoose';

// Import interfaces
import IUser from '../interfaces/user';

// Define model specific interfaces
interface bannerModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc
}
interface UserDoc extends mongoose.Document, IUser {}

// Define mongoose schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  permissions: {
    type: [String],
    required: true
  }
});

// Create static method to create instance of model that uses typescript type checking
userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
}

// Build model from mongoose schema
const User = mongoose.model<UserDoc, bannerModelInterface>('User', userSchema);

// Export completed model
export { User };