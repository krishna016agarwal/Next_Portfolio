// pages/api/admin/check-password.ts
import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {

  const { password} = await req.json();
  console.log(password);
  
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // fallback password

  if (password === ADMIN_PASSWORD) {
return Response.json({
        success: true,
        
      });
  } else {
    return Response.json({
        success: false,
        message: "incorrect password",
       
      });
  }
}
