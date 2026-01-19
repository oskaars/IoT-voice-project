import  nodemailer  from 'nodemailer'
import dotenv from "dotenv"
dotenv.config()


async function sendEmail({to, subject, body}) {
    try{
        const user = process.env.EMAIL_USER 
        const pass = process.env.EMAIL_PASS
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth:{
                user: user,
                pass: pass 
            }
        })
        await transporter.sendMail({from:user, to , subject, text:body})
        return "Mail succesfully sent"

    }catch(error){
        console.error('Error: ', error.message)
        return error.message
    }
}


export { sendEmail }