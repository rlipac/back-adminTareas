import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {


  // TODO: poner en variables de entorno

  try {

    const { email, nombre, token } = datos;
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER_CODE,
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
          <p>que tal ${nombre} Tu cuenta esta casi lista, slo debes compprobarla en el siguiente enlace</p>
  
          <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}"> Comprobar Cuenta</a>
          <p>Si tu no creaste esta cuenta, puedes ignorar este mensage</p>
      `, // html body
    });

  } catch (error) {
    console.log(error, '..erroe en funcion emailRegistro')
  }


}

export const resetPassword = async (datos) => {

  try {
    const { email, nombre, token } = datos;
    console.log(datos)


    // TODO: poner en variables de entorno
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER_CODE, // poner en variables de entorno
        pass: process.env.MAILTRAP_PASS_CODE
      }
      
    });
   


    // send mail with defined transport object
    let info = await transport.sendMail({
      from: '"AdminTareas MERN 👻" <rlipac@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "AdminTareas - cambia tu password", // Subject line
      text: "Restablece tu password", // plain text body
      html: `
        <p>Hola ${nombre} Si no eres tu ignora este aviso o reportala como en peligro</p>
  
        <a href="${process.env.FRONTEND_URL}/nuevo-password/${token}"> Restablece tu contraseña</a>
        <p>Dale Click al enlace y crea un nuevo password</p>
    `, // html body
    });
  } catch (error) {
    console.log(error, '..erroe en funcion resetpassword')
  }

}