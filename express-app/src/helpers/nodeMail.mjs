import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD // Use Google App Password instead of OAuth2
    }
  });

  return transporter;
};

export default createTransporter;





















// //C:\Users\kriss\express-app\src\helpers\nodeMail.mjs

// import nodemailer from 'nodemailer';
// import { google } from 'googleapis';
// import dotenv from 'dotenv';

// dotenv.config();

// const OAuth2 = google.auth.OAuth2;

// const createTransporter = async () => {
//   const oauth2Client = new OAuth2(
//     process.env.GOOGLE_CLIENT_ID, // ClientID
//     process.env.GOOGLE_CLIENT_SECRET, // Client Secret
//     "https://developers.google.com/oauthplayground" // Redirect URL
//   );

//   oauth2Client.setCredentials({
//     refresh_token: process.env.GOOGLE_REFRESH_TOKEN
//   });

//   const accessToken = await new Promise((resolve, reject) => {
//     oauth2Client.getAccessToken((err, token) => {
//       if (err) {
//         reject("Failed to create access token :( ");
//       }
//       resolve(token);
//     });
//   });

//   // USING GOOGLE APP PASSWORD AUTH
  

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: process.env.EMAIL,
//       accessToken,
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       refreshToken: process.env.GOOGLE_REFRESH_TOKEN
//     }
//   });

//   return transporter;
// };

// export default createTransporter;
