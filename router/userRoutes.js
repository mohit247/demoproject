// module.exports = app => {


//     const user = require("../controller/usersignup");
  
//     var router = require("express").Router();
  
//     // Create a new Tutorial
//     router.post('/',user.create)
// }

const {Router} = require ('express');
const router = Router();
const user = require('../controller/usersignup' )
const auth = require('../middleware/auth')


router.post('/me', user.postLoggedInUser)
router.post('/create',user.create)
router.post('/login',user.login)
router.post('/registration',user.signup)
//router.post('/uploadImage',user.uploadimage)
//router.post('/signin',user.login)
router.get('/home', user.getHome)
//router.get('/image', user.getImage)
router.get('/login', user.getLogin)
router.get('/profile', user.getProfile)
router.get('/signup', user.getSignup)
router.get('/getme', user.getLoggedInUser)
router.delete('/deleteAll', user.deleteAll)
router.put('/resetpassword/:id',user.resetpassword);
router.get('/resetpassword/:id',user.getresetpassword);
router.get('/getreset',user.getreset);
router.get('/getresethbs',user.getresethbs);
router.get('/setresethbs',user.setresethbs);


module.exports = router;