import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const LoginSchema = Yup.object().shape({
username: Yup.string().required('Required'),
password: Yup.string().required('Required'),
});

function Login() {
return (
    <div>
     <h1>Login</h1>
     <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values, { setSubmitting }) => {
         axios.post('/api/login', values)
            .then(response => {
             alert('Login successful');
             setSubmitting(false);
            })
            .catch(error => {
             alert('Login failed');
             setSubmitting(false);
            });
        }}
     >
        {({ isSubmitting }) => (
         <Form>
            <div>
             <label htmlFor="username">Username</label>
             <Field type="text" name="username" />
             <ErrorMessage name="username" component="div" />
            </div>
            <div>
             <label htmlFor="password">Password</label>
             <Field type="password" name="password" />
             <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Login</button>
         </Form>
        )}
     </Formik>
    </div>
);
}

export default Login;