const Comment = require('../models/comment');


exports.create = (req, res) => {
    

    const comment = new Comment({
      text: req.body.title,
      blog: req.body.description,
      
    });
  
 
    comment
      .save(comment)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
  };