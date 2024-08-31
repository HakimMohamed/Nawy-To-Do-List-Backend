const crypto = require('crypto');

const jwtSecretKey = crypto.randomBytes(32).toString('base64');

console.log("JWT Secret Key:", jwtSecretKey);