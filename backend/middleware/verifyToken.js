const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
 const authHeader = req.headers['authorization'];

//  console.log("What is the requirmenet...at line 6: ", authHeader)

if (!authHeader) {
  return res.status(403).json({ message: 'No token provided' });
}

const token = authHeader.split(' ')[1]; // This extracts token after 'Bearer '

if (!token) {
  return res.status(403).json({ message: 'No token provided' });
}

// console.log("auth---> ", token)

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  next();
} catch (err) {
  return res.status(401).json({ message: 'Sign up or Login for This' });
}

};

module.exports = verifyToken;
