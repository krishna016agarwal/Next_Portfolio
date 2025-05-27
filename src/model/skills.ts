import mongoose from "mongoose"



const skillSchema= new mongoose.Schema({
    skills: {
        type:[String],
        required:true,
    
    },
  
  },{
    timestamps:true
  });

  const SkillModel = mongoose.models.Skill ||mongoose.model('Skill', skillSchema);

  export default SkillModel;