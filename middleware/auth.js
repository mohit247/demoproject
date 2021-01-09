
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
  // const token = req.header('Authorization')     //.replace('Bearer ', '')
  const token = req.cookies.token
  //  console.log(token);
  //   console.log(req.headers);


    //var token;
    // if ( req.header('Authorization') &&
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith('Bearer')
    // ) {
    //   token = req.headers.authorization.split(' ')[1];
    // } 
  
    if (!token) {
       return res.status(401).json({ error: 'token missing' })
    }
    
    
    

    const data = jwt.verify(token, process.env.JWT_KEY)
    console.log(data);
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth
