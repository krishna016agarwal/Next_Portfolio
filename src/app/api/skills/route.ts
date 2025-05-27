import dbConnect from "@/lib/dbConnect";
import SkillModel from "@/model/skills";





export async function POST(req: Request) {
    await dbConnect();
  
    try {
      const { skills } = await req.json(); // ✅ this matches your frontend
  
      const getSingleSkillDoc = async () => {
        let doc = await SkillModel.findOne();
        if (!doc) {
          doc = new SkillModel({ skills: [] });
          await doc.save();
        }
        return doc;
      };
  
      const skillDoc = await getSingleSkillDoc();
  
      const skillsToAdd = Array.isArray(skills) ? skills : [skills];
  
      // Merge old + new skills, avoid duplicates
      skillDoc.skills = [...new Set([...skillDoc.skills, ...skillsToAdd])];
  
      await skillDoc.save();
  
      return Response.json({
        success: true,
        message: "Skill added successfully",
        data:skillDoc.skills
      });
    } catch (error) {
      console.log("Skill not added", error);
      return Response.json({
        success: false,
        message: "Error",
      });
    }
  }
  


export async function GET() {
    await dbConnect();

    try {
        // const { skill } = await req.json();

        // Utility: get the single document

        const getSingleSkillDoc = async () => {
            let doc = await SkillModel.findOne();
            if (!doc) {
                doc = new SkillModel({ skills: [] });
                await doc.save();
            }
            return doc;
        };




        // GET - fetch all skills from the single document


        const skillDoc = await getSingleSkillDoc();





        return Response.json({
            success: true, skills: skillDoc.skills
        })


    }


    catch (error) {
        console.log('Skills display error');
        return Response.json({
            success: false,
            message: error
        })
    }
}




export async function DELETE(req: Request) {
    await dbConnect();
  
    try {
      const { skills } = await req.json(); // ✅ FIXED: match incoming payload
  
      const getSingleSkillDoc = async () => {
        let doc = await SkillModel.findOne();
        if (!doc) {
          doc = new SkillModel({ skills: [] });
          await doc.save();
        }
        return doc;
      };
  
      const skillDoc = await getSingleSkillDoc();
  
      // ✅ Remove any matching skills
      skillDoc.skills = skillDoc.skills.filter(
        (e: string) => !skills.includes(e)
      );
  
      await skillDoc.save();
  
      return Response.json({
        success: true,
        message: "Skill(s) deleted successfully",
      });
    } catch (error) {
      console.log("Error while deleting skill(s):", error);
      return Response.json({
        success: false,
        message: "Error while deleting skill(s)",
      });
    }
  }
  
