import mongoose,{Schema,Document} from "mongoose"

export interface Project extends Document{
    name:string;
    image:string;
    createdAt:Date;
    github:string;
    projectLink:string;
    technologiesUsed:Array<string>;

}

const projectSchema:Schema<Project> = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true  
    },
    createdAt:{
        type:Date,
     default:Date.now()
    },
    github:{
        type:String,
        required:true  
    },
    projectLink:{
        type:String,
        required:true  
    },
    technologiesUsed:[String] //array of strings
  },{
    timestamps:true
  });

  const ProjectModel = mongoose.models.Project ||mongoose.model<Project>('Project', projectSchema);

  export default ProjectModel;

//   const rawInput = "React, Node.js, MongoDB";
// const technologiesUsed = rawInput.split(',').map(tech => tech.trim());
