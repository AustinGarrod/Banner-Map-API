import mongoose from 'mongoose';

// Import interfaces
import IToken from '../interfaces/token';

// Define model specific interfaces
interface tokenModelInterface extends mongoose.Model<TokenDoc> {
  build(attr: IToken): TokenDoc
}
interface TokenDoc extends mongoose.Document, IToken {}

// Define mongoose schema
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  expiry: {
    type: Date,
    required: true
  }
});

// Create static method to create instance of model that uses typescript type checking
tokenSchema.statics.build = (attr: IToken) => {
  return new Token(attr);
}

// Build model from mongoose schema
const Token = mongoose.model<TokenDoc, tokenModelInterface>('Token', tokenSchema);

// Export completed model
export { Token };