import mongoose from 'mongoose';

// Import interfaces
import IBanner from '../interfaces/banner';

// Define model specific interfaces
interface bannerModelInterface extends mongoose.Model<BannerDoc> {
  build(attr: IBanner): BannerDoc
}
interface BannerDoc extends mongoose.Document, IBanner {}

// Define mongoose schema
const bannerSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  poll: {
    type: String,
    required: false
  },
  edition: {
    type: Number,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  bannerName: {
    type: String,
    required: true
  },
  era: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  sponsor: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  long: {
    type: Number,
    required: true
  }
});

// Create static method to create instance of model that uses typescript type checking
bannerSchema.statics.build = (attr: IBanner) => {
  return new Banner(attr);
}

// Build model from mongoose schema
const Banner = mongoose.model<BannerDoc, bannerModelInterface>('Banner', bannerSchema);

// Export completed model
export { Banner };