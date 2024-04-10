import * as Yup from 'yup';

export const isPhoneValid = (phone) => {
  return Yup.number()
    .integer()
    .positive()
    .test((phone) => {
      return !!(phone && phone.toString().length == 10);
    })
    .isValidSync(phone);
};

export const isEmailValid = (email) => {
  return Yup.string()
    .email()
    .matches(
      /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm
    )
    .isValidSync(email);
};
