import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import CryptoJS from 'crypto-js';
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
   const handleSubmit = (values, { setSubmitting }) => {
      const encryptedPassword = CryptoJS.AES.encrypt(values.password, 'your-secret-key').toString();
      const encryptedValues = {
         ...values,
         password: encryptedPassword,
      };

      axios.post('/api/register', encryptedValues)
      .then(response => {
          alert('Registration successful');
          setSubmitting(false);
      })
      .catch(error => {
          alert('Registration failed');
          setSubmitting(false);
      });
   };

    const onSubmit = (values, { setSubmitting }) => {
      const encryptedPassword = CryptoJS.AES.encrypt(values.password, 'your-secret-key').toString();
      const encryptedValues = {
         ...values,
         password: encryptedPassword,
      };
      console.log(encryptedValues);
      setSubmitting(false)
   }

   return (
      <div className="register-container">
      <div className="register-form">
         <h1>Регистрация</h1>
         <Formik
            initialValues={{ username: '', fullName: '', email: '', password: '' }}
            validationSchema={RegisterSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={onSubmit} 
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