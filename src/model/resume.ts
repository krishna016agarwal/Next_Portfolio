import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
   
    url: {
      type: String,
      required: [true, 'Cloudinary URL is required'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
