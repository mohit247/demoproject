const {Router} = require ('express');
const router = Router();
//const auth = require('../middleware/auth');
const comment = require('../controller/comment' );

router.post('/create',  comment.create );

module.exports = router;




