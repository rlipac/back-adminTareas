import nodemailer from 'nodemailer'

export const  emailRegistro = async (datos)=>{
    const { email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER_CODE, // poner en variables de entorno
          pass: process.env.MAILTRAP_PASS_CODE
        }
      });


// send mail with defined transport object
  let info = await transport.sendMail({
    from: '"AdminTareas MERN 👻" <rlipac@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "AdminTareas - Comfirma tu cuenta", // Subject line
    text: "Comprueba tu cuenta de AdminTareas", // plain text body
    html: `
        <p>Tu cuenta esta casi lista, slo debes compprobarla en el siguiente enlace</p>

        <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}"> Comprobar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensage</p>
    `, // html body
  });
}