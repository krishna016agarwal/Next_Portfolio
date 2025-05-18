import mongoose, { Schema, Document } from "mongoose";

export interface Certification extends Document {
  name: string;
  image: string;
  instituteName: string;
}

const certificationSchema: Schema<Certification> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },

    instituteName: {
      type: String,
      required:true
    },
  },
  {
    timestamps: true,
  }
);

const CertificationModel =
  mongoose.models.Certification ||
  mongoose.model<Certification>("Certification", certificationSchema);

export default CertificationModel;
