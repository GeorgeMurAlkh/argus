import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavigateFunction, useNavigate, Link } from 'react-router-dom';
import { emailSchema, passwordSchema } from '../helpers/yup.schemas';
import { login } from '../services/auth.service';


const Login = () => {
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const initialValues: {
    email: string;
    password: string;
  } = {
    email: 'test@test.test',
    password: 'test',
  };

  const validationSchema = Yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
  });
  const handleLogin = (form: { email: string; password: string }) => {
    const { email, password } = form;

    setMessage('');
    setLoading(true);

    login(email, password).then(() => {
        navigate('/vehicles');
        window.location.reload();
      }).catch(error => {
        const resMessage = error.response?.data?.message || error.toString();

        setLoading(false);
        setMessage(resMessage);
      });
  };

  return (
    <div className="col-md-12">
      <div className="card card-container w-50">
      <img
          src="/ArgusNewWhiteFix3.webp"
          alt="profile-img"
          className="profile-img-card"
        />
        <h2>Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="alert alert-danger mt-3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger mt-3"
              />
            </div>

            <div className="form-group mt-3">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group mt-3">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
        <Link to={'/register'} className="link mt-2 text-center">
              Don't have an account? Register!
        </Link>
      </div>
    </div>
  );
};

export default Login;
