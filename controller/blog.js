const multer = require('multer');
const Blog = require('../models/blog');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth')
const helpers = require('../helpers/helpers')
const helpStorage = require('../helpers/storage')

exports.getcreate =  (req, res) => {
  res.render('createpost');
}

exports.getAllBlog = (req, res) => {

  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

 Blog.find(condition).lean()
    .then(data => {
    // data =  Buffer.from(data.img).toString('base64');

      console.log(data)
      //res.send(data);
      res.render('index', {data: data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}

exports.deleteAll = res => {
  Blog.deleteMany({})
  .then(data => {
    res.send({
      message: `${data.deletedCount} Blog were deleted successfully!`
    });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all tutorials."
    });
  });

}

  
exports.create =   (req, res, ) => {



  let upload = multer({ storage: helpStorage.storage, fileFilter: helpers.imageFilter }).single('image');

  upload(req, res, function (err) {
    

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    else if (!req.file) {
      return res.send('Please select an image to upload');
    }
    else if (err instanceof multer.MulterError) {
      return res.send(err);
    }
    else if (err) {
      return res.send(err);
    }
    console.log("uploaded")

   
          var img = new Blog(req.body);
          img.img.path = req.file.path ;
          console.log(img.img.path);
           //img.contentType = 'image/jpeg';
          
      
           img.save();
          res.json({ message: 'New blog created ' });

    // // Display uploaded image for user validation
    // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="100%"><hr />`);
  }); //end of function upload


}


// exports.uploadimage = (req, res) => {
//   let upload = multer({ storage: helpStorage.storage, fileFilter: helpers.imageFilter }).single('image');

//   upload(req, res, function (err) {
    

//     if (req.fileValidationError) {
//       return res.send(req.fileValidationError);
//     }
//     else if (!req.file) {
//       return res.send('Please select an image to upload');
//     }
//     else if (err instanceof multer.MulterError) {
//       return res.send(err);
//     }
//     else if (err) {
//       return res.send(err);
//     }
//     console.log("uploaded")
   
//           var new_img = new Img;
//           new_img.img.data = fs.readFileSync(req.file.path)
//           new_img.img.contentType = 'image/jpeg';
//           new_img.save();
//           res.json({ message: 'New image added to the db!' });

//     // // Display uploaded image for user validation
//     // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="100%"><hr />`);


//   }); //end of function upload


// }