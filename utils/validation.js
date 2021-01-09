const yup = require ('yup');

const userSchema = yup.object().shape({
    name: yup.string().required().min(4).max(15),
    dob: yup.date().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).max(20),
    user: yup.string(),
    //content: yup.string().min(4).max(100).required(),
   // Title: yup.string().min(4).max(10).required(),
    });


    exports.userschema = userSchema ;
