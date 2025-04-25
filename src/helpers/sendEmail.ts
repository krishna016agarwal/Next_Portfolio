import { resend } from "@/lib/resend";

import { Email } from "@/components/email-template";

export async function sendEmail(
    email:string,
 username:string,
 message:string,

){
try {

    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: 'krishna016agrawal@gmail.com',
        subject: 'Portfolio User Message',
        react: Email({ email,username,message}),
      });
    
      


    return {successs:true,message:'Email send successfully'}
} catch (error) {
    console.log("Error sending emails",error);
    return {successs:false,message:'Failed to send email'}
}
}