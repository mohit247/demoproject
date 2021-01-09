const express = require('express')
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../utils/validation')
const flash = require('connect-flash');
const auth = require('../middleware/auth')
const sendMail = require('../services/emailService');
const { text } = require('body-parser');
const { error } = require('console');
const { nextTick } = require('process');
//const user = require('../models/user');
// var cookieParser = require('cookie-parser')



exports.getHome = (req, res) => {
  
  res.render('index');


}


exports.getSignup = (req, res) => {
  try{
  res.render('signup')
  } catch (e) {
    res.status(500);
  }
}
exports.getLogin = (req, res) => {
  res.render('login');


}


exports.signup = async (req, res) => {
  try {
   const requestbody  = req.body ;
    //console.log(requestbody);
    try {
      userSchema.userschema.validate(requestbody)
      .then(() =>{
        console.log("ok")
      }).catch(error => res.render('signup', {error: error} ))
    }


  catch {(error => {
   
    console.log(error);
    
    //res.render('signup', {error: error } )
  //   //res.render('signup') ;
  //  // res.redirect('/user/registration')
  //  //res.redirect('/user/singup');
   })
  }
   // console.log(requestbody);
    const user = new User(requestbody);
    await user.save()
    const token = await user.generateAuthToken()
    
    var emailFrom = process.env.EMAIL_FROM ;
    var emailTo = req.body.email ;
    var name = req.body.name ;
    
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'thank you ',
        text: `${emailFrom} welcomes you`,
        html: require('../services/emailTemplate')({
          name: name
        })
        
    }).then(() => {
        return res.render('createpost');

    }).catch(err => {
        return res.status(500).json({ error: 'error in email sending' });

    });
    //res.status(201).send({ user, token })
  } 
   catch (error) {
   console.log(error)
    //res.render('signup', {error: error } )
    // res.render('signup');
    //res.status(400).send(error)
    //res.redirect('/user/signup')
  }
}

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body
//     console.log(req.body);
//     const user = await User.findByCredentials(email, password)
//     console.log(user);
//     if (!user) {
//         return res.status(401).send({error: 'Login failed! Check authentication credentials'})
//     }
//     const token = await user.generateAuthToken()
//     res.render('index')
//     res.send({ user, token })
// } catch (error) {
//     res.status(400).send(error)
// }

// }

exports.login = async (req, res) => {

  // const errors = validationResult(req);

  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      email
    });
    //console.log(user);
    if (!user)
      return res.status(400).json({
        message: "User Not Exist"
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect Password !"
      });



    const payload = {
      user: {
        id: user.id
      }
    };

   jwt.sign(
      payload,
      process.env.JWT_KEY,
      {
        expiresIn: 36000
      },
      (err, token) => {
        if (err) throw err;
        // res.status(200).json({
        //   token
        // });
       // console.log(token);
        //res.status(200).send({ auth: true, token: token });
         res.cookie("token", token, { maxAge: 36000 })
        // console.log(token)//.render('createpost')
        // auth.token = token;
        // auth.status = true;
        // console.log(token);
        //console.log(auth.token)
        //res.render("profile", { token: token };)

        res.render('createpost');
      }
    );
    
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }
}

exports.getLoggedInUser =  (req,res) => {
  res.send(req.user);
}

exports.postLoggedInUser =  (req,res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token != req.token
    })
  //  console.log(req.user)
     req.user.save()
    res.send()
} catch (error) {
    res.status(500).send(error)
}
}



exports.create = (req, res) => {
  

  // Create a user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dob: req.body.dob,
    accountCreated: req.body.accountCreated

  });

  // Save user in the database
  user
    .save(user)
    .then(data => {
      // res.send(data);
      res.render('profile');
      //res.redirect(`/profile/?name=${req.body.name}`)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user."
      });
    });
};

exports.getProfile = async (req, res) => {
  const user = await User.findOne({ name: req.query.name }) //getting our document back from our database.
  // let user = User.find({userName: req.query.userName})
  if (user == null) {
    res.render('profile', { err: "that user doesn't exist" })
    return; // if th euser doenst exist it wont run the code below
  };
  console.log(user) // so we can see what is in the user document - its an object.
  res.render('profile', { user: user.toObject() }); 
}

exports.deleteAll = (req,res) => {
  User.deleteMany({})
  .then(data => {
    res.send({
      message: `${data.deletedCount} Blog were deleted successfully!`
    });
  })
  .catch(err => {
    //res.status(500) 
    console.log(err);
  }) 
  //.send({
    //   message:
    //     err.message || "Some error occurred while removing all tutorials."
    // });
  // });

}

exports.resetpassword = (req,res) => {
  const id = req.params.id;
  console.log(id)
  const requestbody  = req.body ;
  try {
    const requestbody  = req.body ;
   //  console.log(requestbody);
    //  try {
    //    userSchema.userschema.validate(requestbody)
    //    .then(() => {
    //      console.log("ok")
    //    }).catch(error => //res.render('resetpassword', {error: error} ))
    //    console.log(error) )
    //  }catch (error) {
    //   console.log(error)
    //    //res.render('signup', {error: error } )
      
    //  }
 
    
        User.findByIdAndUpdate(id, requestbody, { useFindAndModify: false } )
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update password with id=${id}. `
        });
      } else res.send({ message: "password was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating password with id=" + id
      });
    });
    }
 
  catch (error) {
    console.log(error)
     //res.render('signup', {error: error } )
   }

  }//end of exports fun
  exports.getresethbs = (req,res) => {
    res.render('getreset')
  }
  exports.setresethbs = (req,res) => {
    res.render('setreset')
  }

  exports.getreset = async (req,res) => {
    //res.render('getreset')
     const email = req.query.email
     var emailFrom = process.env.EMAIL_FROM ;
    //  var name = "hello";
    // var emailTo = req.body.email ;
    //console.log(req.query.email)
    try{
  await  User.findOne({email: email})
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found user" }); 
      }
      else{
        const name = data.name;
const _id = data._id ;
       // const id = data._id ;
        console.log(_id)
        sendMail({
          from: emailFrom,
          to: email,
          subject: 'password reset ',
          text: `${emailFrom} welcomes you`,
          html: require('../services/emailtemplate/emailTemplate')({
            name: name
          })
          
      }).then(() => {
          //return res.render('setreset', {_id:_id});
        //  console.log("hello world");
    res.redirect('/user/resetpassword/'+ _id) //.render('setreset', {_id:_id});
      }).catch(err => {
          return res.status(500).json({ error: 'error in email sending' });
    
      });
      }
     // else  res.render('getreset' ,{ data: data._id});
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving user" });
    });

   
  }
  catch{(error)=>{
    console.log(error);
  }}

  }

  exports.getresetpassword = (req,res) => {
    res.render('setreset')
  }
