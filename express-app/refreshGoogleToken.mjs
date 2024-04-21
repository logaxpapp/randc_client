import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

const tokenEndpoint = 'https://oauth2.googleapis.com/token';
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const requestBody = {
  client_id: clientId,
  client_secret: clientSecret,
  refresh_token: refreshToken,
  grant_type: 'refresh_token'
};

axios.post(tokenEndpoint, qs.stringify(requestBody), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
  .then(response => {
    // Handle the response containing the new access token
    console.log('New Access Token:', response.data.access_token);
    // You can now use this access token to send emails via nodemailer
  })
  .catch(error => {
    // Handle any errors
    console.error('Error refreshing the access token:', error);
  });
