const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Nome deve ter entre 2 e 30 caracteres";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Campo de Nome é requirido";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Campo de Email é requirido";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email inválido";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Campo de Senha é requirido";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Senha deve ter entre 6 e 30 caracteres";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Campo de Confirmação de Senha é requirido";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "A senha e a confirmação de senha estão diferentes";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
