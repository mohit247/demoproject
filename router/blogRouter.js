const {Router} = require ('express');
const router = Router();
const blog = require('../controller/blog' )
//const auth = require('../middleware/auth')

//router.post('/',image.uploadimage);
// router.get('/image',image.getImage);
// router.get('/imagedata',image.getImagedata);
router.post('/create', blog.create );
router.get('/getcreate', blog.getcreate );
router.get('/getall', blog.getAllBlog);
router.delete('/deleteall', blog.deleteAll);
//router.delete('/deleteone', blog.deleteOne);



module.exports = router;