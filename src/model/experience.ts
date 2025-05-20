import mongoose,{Schema,Document} from "mongoose"



const experienceSchema= new mongoose.Schema({
   name:{
    type:String,
    require:true,
   },
   timeperiod:{
    type:String,
    require:true,
   },
   organisation:{
    type:String
   }
  },{
    timestamps:true
  });

  const ExperienceModel = mongoose.models.Experience ||mongoose.model('Experience', experienceSchema);

  export default ExperienceModel;