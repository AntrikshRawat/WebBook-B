const jwt = require('jsonwebtoken');
const SECRET_SIGN = 'vijay';
const fetchuser = async (req, res, next) => {
          //get the user from jwt token and id to request object
          const token = req.header('authtoken');
          if (!token) {
                    return res.status(401).send("you need to login first!");
          }
        try {
            const data = jwt.verify(token , SECRET_SIGN);
              req.user = data.user;
              next(); 
        }  catch (error) {
          console.error(error.message);
          success = false;
          res.status(401).json({success,error});
        }  
}
module.exports = fetchuser;