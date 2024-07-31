import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import apiPaths from '../../utilits/apiPaths';
import apiClient from '../../utilits/apiClient';

const LoginSchema = Yup.object().shape({
username: Yup.string().required('Поле обязательно для заполнения'),
password: Yup.string().required('Поле обязательно для заполнения'),
});

function Login() {
   const [errorMessage, setErrorMessage] = useState('');
   const navigate = useNavigate();
return (
    <div>
     <h1>Вход в хранилище</h1>
     <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
         localStorage.clear();
         apiClient.post(apiPaths.login, values)
            .then(response => {
               const token = response.data.auth_token;
               localStorage.setItem('authToken', token);             
               setSubmitting(false);
               setErrorMessage('');
               navigate('/storage');
            })
            .catch(error => {
               let errorMsg = 'Неверный логин или пароль'
               // if (error.response && error.response.data && error.response.data.message) {
               //    errorMsg = error.response.data.message;
               // } else if (error.message) {
               //    errorMsg = error.message;
               // }
               setErrorMessage(errorMsg);
               setSubmitting(false);
            });
        }}
     >
        {({ isSubmitting }) => (
         <Form>
            <div>
             <label htmlFor="username">Логин </label>
             <Field type="text" name="username" />
             <ErrorMessage name="username" component="div" />
            </div>
            <div>
             <label htmlFor="password">Пароль </label>
             <Field type="password" name="password" />
             <ErrorMessage name="password" component="div" />
            </div>
            {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            <button type="submit" disabled={isSubmitting}>Войти</button>
         </Form>
        )}
     </Formik>
    </div>
);
}

export default Login;