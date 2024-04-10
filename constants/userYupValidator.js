import * as Yup from 'yup';
import { basicInfoLabel } from './labelText';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const UserValidator = Yup.object({
  name: Yup.string()
    .min(3, 'Too short')
    .max(45, 'Too Long')
    .trim()
    .required(basicInfoLabel.name.error)
    .matches(/^[A-Za-z\s]*$/, 'Please enter valid name'),
  email: Yup.string()
    .email('Email is not valid')
    .trim()
    .min(3, 'Too short')
    .max(45, 'Too Long')
    .required()
    .matches(
      /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm,
      'Please enter valid email'
    ),
  mobile: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .trim()
    .required(basicInfoLabel.phone.error)
    .min(10)
    .max(10),
  dob: Yup.string().required(basicInfoLabel.dob.error),
  gender: Yup.string().required(basicInfoLabel.gender.error),
  address: Yup.array().of(
    Yup.object().shape({
      address: Yup.string()
        .trim()
        .min(3, 'Too short')
        .max(25, 'Too Long')
        .required(basicInfoLabel.address.error)
        .matches(/^[A-Za-z,\s]*$/, 'Please enter valid address'),
      landmark: Yup.string()
        .trim()
        .min(3, 'Too short')
        .max(25, 'Too Long')
        .required(basicInfoLabel.landmark.error),
      city: Yup.string()
        .trim()
        .min(3, 'Too short')
        .max(25, 'Too Long')
        .required('Select Your City')
        .matches(/^[A-Za-z\s]*$/, basicInfoLabel.city.error),
      zip: Yup.string()
        .required(basicInfoLabel.pin.error)
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(6, 'Must be exactly 6 digits')
        .max(6, 'Must be exactly 6 digits'),
    })
  ),
});
