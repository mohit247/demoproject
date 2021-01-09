const {Router} = require ('express');
const router = Router();
const auth = require('../middleware/auth');
const blog = require('../controller/blog' );

//const auth = require('../middleware/auth')

//router.post('/',image.uploadimage);
// router.get('/image',image.getImage);
// router.get('/imagedata',image.getImagedata);
router.post('/create',  blog.create );
router.get('/getbycomment',  blog.getByComment );

router.get('/getcreate', blog.getcreate );
router.get('/getall',  blog.getAllBlog);
router.delete('/deleteall',  blog.deleteAll);
router.put('/update', blog.update);

router.delete('/deleteone', blog.delete);



module.exports = router;