import * as Yup from 'yup';

export const emailSchema = Yup.string()
  .email('This is not a valid email.')
  .required('This field is required!')

export const passwordSchema = Yup.string()
  .min(4, 'Password should be between 4 and 20 characters.')
  .max(20, 'Password should be between 4 and 20 characters.')  
  .required('This field is required!')

export const vehicleNameSchema = Yup.string()  
  .min(1, 'vehicle name should be between 1 and 50 characters.')
  .max(50, 'Password should be between 1 and 50 characters.')  
  .required('This field is required!')
