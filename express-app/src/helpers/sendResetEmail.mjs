//  C:\Users\kriss\express-app\src\helpers\sendResetEmail.mjs

import createTransporter from './nodeMail.mjs';





const logoUrl = 'https://asset.cloudinary.com/dkr0odvfi/6ad09af0461b3ca84ace3d4c79588a1b';

export const sendResetEmail = async (email, resetUrl) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <img src="${logoUrl}" alt="Logo" style="width: 100px; height: auto;">
      <p>To reset your password, please click on the link below or paste it into your browser:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
    // other properties...
  };

  await transporter.sendMail(mailOptions);
};


export const sendConfirmationEmail = async (email) => {
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Password Has Been Reset',
      text: 'This is a confirmation that the password for your account has just been changed.',
    };
  
    await transporter.sendMail(mailOptions);
  };

  
  
  export const sendRegistrationEmail = async (email, registrationUrl, tenantName) => {
    const transporter = await createTransporter();
    const mailOptions = {
        from: `"LoGaXP Platform" <${process.env.EMAIL}>`, // Sender address representing the platform
        to: email,
        subject: `Invitation from LoGaXP Platform`, // Subject line
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <img src="${logoUrl}" alt="LoGaXP Logo" style="max-width: 100px; height: auto; margin-bottom: 20px;">
                    <p>Greetings from LoGaXP Platform,</p>
                    <p>You have been invited by ${tenantName} to register on our platform. Please click on the link below or paste it into your browser to complete your registration:</p>
                    <p><a href="${registrationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Complete Registration</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>For any enquiries, please contact us at <a href="mailto:enquiries@logaxp.com">enquiries@logaxp.com</a> or call us at <a href="tel:+18002223592">+1 800 222 3592</a>.</p>
                    <p>Best regards,<br>LoGaXP Platform</p>
                </div>
            </div>
        `, // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

  


  export const sendRegistrationEmailConfirmation = async (email, registrationUrl) => {
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: email, // List of receivers
      subject: 'Registration Confirmation', // Subject line
      text: `You have successfully registered on our platform. Please use the following link to login:\n\n${registrationUrl}\n\nIf you did not request this, please ignore this email.`, // Plain text body
      html: `<p>You have successfully registered on our platform. Please click on the link below or paste it into your browser to login:</p><a href="${registrationUrl}">${registrationUrl}</a><p>If you did not request this, please ignore this email.</p>`, // HTML body
    };

    await transporter.sendMail(mailOptions);
  }