
// allowedOrigins.mjs
const allowedOrigins = [
    'http://localhost:3000', // Allow local development
    'https://www.yourproductiondomain.com', // Production domain
    'https://yourstagingdomain.com', // Staging domain
    // Add any other domains you want to allow requests from
];

export default allowedOrigins;
// This file is a simple array of allowed origins that can be used to whitelist domains for CORS (Cross-Origin Resource Sharing) requests. It's a good practice to use a whitelist to prevent unauthorized requests from unknown origins. You can add any domain you want to allow requests from to this array. For example, you can add your production and staging domains to the array to allow requests from those domains. You can also add localhost to allow requests from your local development environment. This file is used in the CORS middleware to check the origin of incoming requests and decide whether to allow or deny them based on the allowed origins.