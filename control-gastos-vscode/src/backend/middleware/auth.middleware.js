
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(req, res, next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    req.userId = payload.userId;
    next();
  }catch(err){ return res.status(401).json({ message: 'Token inválido' }); }
}
