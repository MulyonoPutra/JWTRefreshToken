/* eslint-disable linebreak-style */
// eslint-disable-next-line max-len
import {registerValidation, logInValidation, refreshTokenValidation} from '../utility/ValidationSchema.js';
import User from '../models/User.js';
import UserToken from '../models/UserToken.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateToken from '../utility/GenerateToken.js';
import {
  verifyRefreshToken,
} from '../utility/VerifyRefreshToken.js';


const register = async (roles, req, res) => {
  try {
    const {error} = registerValidation(req.body);
    if (error) {
      return res
          .status(400)
          .json({error: true, message: error.details[0].message});
    }

    const user = await User.findOne({email: req.body.email});
    if (user) {
      return res
          .status(400)
          .json({error: true, message: 'User with given email already exist'});
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    await new User({...req.body, password: hashPassword, roles}).save();

    res
        .status(201)
        .json({error: false, message: 'Account created sucessfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json({error: true, message: 'Internal Server Error'});
  }
};


const login = async (req, res) => {
  try {
    const {error} = logInValidation(req.body);
    if (error) {
      return res
          .status(400)
          .json({error: true, message: error.details[0].message});
    }

    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return res
          .status(401)
          .json({error: true, message: 'Invalid email or password'});
    }

    const verifiedPassword = await bcrypt.compare(
        req.body.password,
        user.password,
    );
    if (!verifiedPassword) {
      return res
          .status(401)
          .json({error: true, message: 'Invalid email or password'});
    }

    const {accessToken, refreshToken} = await generateToken(user);

    const userInfo = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      roles: user.roles.toString(),
    };

    res.status(200).json({
      message: 'Logged in sucessfully',
      error: false,
      accessToken,
      refreshToken,
      userInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({error: true, message: 'Internal Server Error'});
  }
};

const refreshToken = async (req, res) => {
  const {error} = refreshTokenValidation(req.body);
  if (error) {
    return res
        .status(400)
        .json({error: true, message: error.details[0].message});
  };

  verifyRefreshToken(req.body.refreshToken)
      .then(({tokenDetails}) => {
        const payload = {_id: tokenDetails._id, roles: tokenDetails.roles};
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            {expiresIn: '14m'},
        );
        res.status(200).json({
          error: false,
          accessToken,
          message: 'New Access token created successfully',
        });
      })
      .catch((err) => res.status(400).json(err));
};

const logout = async (req, res) => {
  try {
    const {error} = refreshTokenValidation(req.body);
    if (error) {
      return res
          .status(400)
          .json({error: true, message: error.details[0].message});
    }

    const userToken = await UserToken.findOne({token: req.body.refreshToken});
    if (!userToken) {
      return res
          .status(200)
          .json({message: 'Logged Out Sucessfully'});
    }
    await userToken.remove();
    res.status(200).json({message: 'Logged Out Sucessfully'});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal Server Error'});
  }
};


export {register, login, logout, refreshToken};
