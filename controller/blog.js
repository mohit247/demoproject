const multer = require('multer');
const Blog = require('../models/blog');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth')
const helpers = require('../utils/helpers')
const helpStorage = require('../utils/storage')
const yup = require('../utils/validation')
exports.getcreate = (req, res) => {

  res.render('createpost');
}
exports.getByComment = (req, res) => {
  const blogs =  Blog.find({})
  .populate('comments', 'text')
  .populate('user', 'name')
//res.send(blogs)
console.log(blogs.map(b => b.toJSON()))
//res.json(blogs.map(b => b.toJSON()))
}


exports.getAllBlog = (req, res) => {

  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Blog.find(condition).lean()
    .then(data => {
      // data =  Buffer.from(data.img).toString('base64');

      console.log(data)
      //res.send(data);
      res.render('index', { data: data });
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


exports.create = (req, res,) => {


  // const user= req.user ;
  // console.log(user);

  const requestbody = req.body;
  //console.log(requestbody);
  try {
    yup.userschema.validate(requestbody)
      //  userSchema.userschema.validate(requestbody)
      .then(() => {
        console.log("ok")
      }).catch(error => res.render('createpost', { error: error }))
  }
  catch {
    (error => {

      console.log(error);


    })
  }



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



    const requestbody = req.body;
    //console.log(requestbody);
    try {
      yup.userschema.validate(requestbody)
        //  userSchema.userschema.validate(requestbody)
        .then(() => {
          console.log("ok");
          var img = new Blog(requestbody);
    img.img.path = req.file.path;
    console.log(img.img.path);
    //img.contentType = 'image/jpeg';


    img.save();
    res.json({ message: 'New blog created ' });

        }).catch(error => res.render('createpost', { error: error }))
    }
    catch {
      (error => {

        console.log(error);


      })
    }



    // yup.userschema.validate(requestbody)
    // var img = new Blog(req.body);
    // img.img.path = req.file.path;
    // console.log(img.img.path);
    // //img.contentType = 'image/jpeg';


    // img.save();
    // res.json({ message: 'New blog created ' });

    // // Display uploaded image for user validation
    // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="100%"><hr />`);
  }); //end of function upload


}

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Blog.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Blog with id=${id}. Maybe Blog was not found!`
        });
      } else res.send({ message: "Blog was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Blog with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Blog with id=${id}. Maybe Blog was not found!`
        });
      } else {
        res.send({
          message: "Blog was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Blog with id=" + id
      });
    });
};


