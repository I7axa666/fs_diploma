import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import apiPaths from '../../utilits/apiPaths';
import apiClient from '../../utilits/apiClient';
import './Style.css'

const RegisterSchema = Yup.object().shape({
username: Yup.string()
    .matches(/^[a-zA-Z][a-zA-Z0-9]{3,19}$/, 'Только латинские буквы и цифры от 4 до 20 символов')
    .required('Обязательное поле'),
fullName: Yup.string().required('Обязательное поле'),
email: Yup.string().email('Неверный формат email').required('Обязательное поле'),
password: Yup.string()
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 'пароль — не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ')
    .required('Обязательное поле'),
});

function Register() {
   const navigate = useNavigate();
   const [errorMessage, setErrorMessage] = useState('');

   const handleSubmit = (values, { setSubmitting }) => {
      localStorage.clear();
      apiClient.post(apiPaths.register, values)
      .then(() => {
         setErrorMessage('')
          setSubmitting(false);
          navigate('/login');
      })
      .catch(error => {
         let errorMsg = 'Произошла ошибка при регистрации. Попробуйте ввести другой пароль';
         // if (error.response && error.response.data && error.response.data.message) {
         //  errorMsg = error.response.data.message;
         // } else if (error.message) {
         //  errorMsg = error.message;
         // }
         
         console.log(error.response.data);
         setErrorMessage(errorMsg);
         setSubmitting(false);
      });
   };

   return (
      <div className="register-container">
      <div className="register-form">
         <h1>Регистрация</h1>
         <Formik
            initialValues={{ username: '', fullName: '', email: '', password: '' }}
            validationSchema={RegisterSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={handleSubmit} 
         >
            {({ isSubmitting }) => (
               <Form>
               <div className="form-group">
                  <label htmlFor="username">Ваш логин</label>
                  <Field type="text" name="username" />
                  <ErrorMessage name="username">
                  {msg => <div className="error-message">{msg}</div>}
                  </ErrorMessage>
               </div>
               <div className="form-group">
                  <label htmlFor="fullName">Полное имя</label>
                  <Field type="text" name="fullName" />
                  <ErrorMessage name="fullName">
                  {msg => <div className="error-message">{msg}</div>}
                  </ErrorMessage>
               </div>
               <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" />
                  <ErrorMessage name="email">
                  {msg => <div className="error-message">{msg}</div>}
                  </ErrorMessage>
               </div>
               <div className="form-group">
                  <label htmlFor="password">Пароль</label>
                  <Field type="password" name="password" />
                  <ErrorMessage name="password">
                  {msg => <div className="error-message">{msg}</div>}
                  </ErrorMessage>
               </div>
               {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
               <div className="form-group">
                  <button type="submit" disabled={isSubmitting}>Зарегистрироваться</button>
               </div>
               </Form>
            )}
         </Formik>
      </div>
      </div>
    );
}

export default Register;