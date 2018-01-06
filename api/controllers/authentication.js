
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config/config')
const base64Img = require('base64-img')
//const boom = require("boom");
const path = require('path')

var sendJSONresponse = function (res, status, content) {
  res.status(status).json(content)
}

//  Generate jwt
function generateToken(user) {
  return jwt.sign(user, config.secret, {})
}

//  Set user info from request
 function setUserInfo(user) {
  let getUserInfo = {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: user.name, 
    fbId: user.fbId,
    profilePicture: user.profilePicture
  }

  return getUserInfo
}

/*
 * Login route /auth/login
 */
function login(req, res, next) {
  try {
    console.log(req.user)
    let userInfo = setUserInfo(req.user)
  
    sendJSONresponse(res, 200, {
      token: generateToken(userInfo),
      user: userInfo
    })
  } catch (error) {
    return next(error)
  }
}

/*
 *  Register route /auth/register
 */
async function register(req, res, next) {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const role = req.body.role;

    if (!email || !name || !password)
     {
      sendJSONresponse(res, 422, {
        error: 'Es necesario ingresar nombre, email y password'
      })
      return
     }

    let userExist = await User.findOne({ email: email });
    if (userExist) {
      sendJSONresponse(res, 422, {
        error: 'ese email ya existe',
        status: false
      })
      return
    }
    let user = new User({
      email: email,
      name: name,
      password: password,
      role: role
    })

    if (req.body.image) {
      let fileName = Date.now();
      let filepath = base64Img.imgSync(
        req.body.image,
        path.join("/public/images", "user"),
        fileName
      );
      user.image = "/images/user/" + fileName + path.extname(filepath);
    }

    user = await user.save()

    let userInfo = setUserInfo(user)
    sendJSONresponse(res, 201, {token: generateToken(userInfo), user: userInfo})

  } catch (e) {
    return next(e);
  }
}  

//  Role authorization check               FALTA PONERLE EL AWAI
function roleAuthorization(role) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        sendJSONresponse(res, 422, {
          error: "No se encontro usuario"
        });
        return next(err);
      }
      //  If user is found, check role.
      if (foundUser.role === role) {
        return next();
      }

      sendJSONresponse(res, 401, {
        error: "No estas autorizado a ver este contenido."
      });
      return next("Unauthorized");
    });
  };
}

//  Forgot password Route
function forgotPassword(req, res, next) {
  const email = req.body.email;

  User.findOne(
    {
      email: email
    },
    function(err, existingUser) {
      //  If user is not found, return error
      if (err || existingUser == null) {
        sendJSONresponse(res, 422, {
          error: "No se encontro usuario"
        });
        return next(err);
      }
      //  If user is found, generate and save resetToken

      //  Generete a token with crypto
      crypto.randomBytes(48, function(err, buffer) {
        const resetToken = buffer.toString("hex");
        if (err) {
          return next(err);
        }

        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordExpires = Date.now() + 3600000; //  1 hour

        existingUser.save(function(err) {
          if (err) {
            return next(err);
          }

          // const message = {
          //  subject: 'Reset Password',
          //  text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          //  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          //  'http://' + req.headers.host + '/reset-password/' + resetToken + '\n\n' +
          //  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          // }
          //  Otherwise, send user email via Mailgun
          // mailgun.sendEmail(existingUser.email, message)

          sendJSONresponse(res, 200, {
            message:
              "Por favor revisa tu email y sigue el link para poder recuperar tu contraseña"
          });
          next();
        });
      });
    }
  );
}

//  Reset password Route
function verifyToken(req, res, next) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    },
    function(err, resetUser) {
      //  If query returned no results, token expires or was invalid. Return error.
      if (err) {
        sendJSONresponse(res, 500, err);
        next(err);
      }
      if (!resetUser) {
        res.status(422).json({
          error:
            "Your token has expired. Please attempt to reset your password again."
        });
      }

      //  Otherwise, save new password and clear resetToken from database
      resetUser.password = req.body.password;
      resetUser.resetPasswordToken = undefined;
      resetUser.resetPasswordExpires = undefined;

      resetUser.save(function(err) {
        if (err) {
          return next(err);
        }

        //  If password change saved succesfully, alert user via email
        const message = {
          subject: "Password Changed",
          text:
            "You are receiving this email because you changed your password. \n\n" +
            "If you did not request this change, please contact us immediately."
        };

        //  Otherwise, send user email confirmation of password change via Mailgun
        // mailgun.sendEmail(resetUser.email, message)

        res.status(200).json({
          message:
            "Password changed succesfully. Please login with your new password"
        });
        next();
      });
    }
  );
}
function facebookLogin(req, res, next) {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const facebookId = req.body.facebookId;

  if (!email) {
    sendJSONresponse(res, 422, {
      message: "email is required"
    });
    return;
  }
  if (!firstName || !lastName) {
    sendJSONresponse(res, 422, {
      message: "firstname and lastname are requireds"
    });
    return;
  }
  if (!facebookId) {
    sendJSONresponse(res, 422, {
      message: "facebookId are requireds"
    });
    return;
  }

  User.findOne(
    {
      facebookId: facebookId
    },
    (err, existingUser) => {
      if (err) return next(err);

      if (existingUser) {
        let userInfo = setUserInfo(existingUser);
        sendJSONresponse(res, 200, {
          token: generateToken(userInfo),
          user: userInfo
        });
        return;
      }

      let user = new User({
        email: email,
        facebookId: facebookId,
        firstName: firstName,
        lastName: lastName,
        profilePicture: `https://graph.facebook.com/${
          facebookId
        }/picture?type=small`
      });

      user.save((err, user) => {
        let userInfo = setUserInfo(user);

        sendJSONresponse(res, 201, {
          token: generateToken(userInfo),
          user: userInfo
        });
      });
    }
  );
}


module.exports = {
  login,
  register,
  roleAuthorization,
  forgotPassword,
  verifyToken,
  facebookLogin
}