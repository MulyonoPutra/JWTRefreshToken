/* eslint-disable linebreak-style */
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const logInValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(body);
};

const registerValidation = (body) => {
  const schema = Joi.object({
    userName: Joi.string().required().label('User Name'),
    email: Joi.string().email().required().label('Email'),
    password: passwordComplexity().required().label('Password'),
  });
  return schema.validate(body);
};

const refreshTokenValidation = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label('Refresh Token'),
  });
  return schema.validate(body);
};

export {
  registerValidation,
  logInValidation,
  refreshTokenValidation,
};
