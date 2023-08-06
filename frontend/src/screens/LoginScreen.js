import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';

import { toast } from 'react-toastify';

import axios from 'axios';
import { getError } from '../utils';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/home';

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(true);
  const [errors, setErrors] = useState({});
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (!!errors[field]) setErrors({ ...errors, [field]: null });
  };

  const validateForm = () => {
    const { email, password } = form;
    const newErrors = {};

    if (!email || email === '') newErrors.email = 'Entrez votre email';
    if (!password || password === '')
      newErrors.password = 'Entrez votre mot de passe';

    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const result = await axios.post('/users/login', form);

      delete result.data.announcementMsg;
      ctxDispatch({
        type: 'USER_SIGNIN',
        payload: { ...result.data, token: result.headers.authorization },
      });
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          ...result.data,
          token: result.headers.authorization,
        })
      );
      // console.log(result.data);
      navigate(redirect || '/home');
    } catch (err) {
      console.log(err.message);
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="p-5 signinScreen">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Container>
        <Form onSubmit={submitHandler} noValidate>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type={showPassword ? 'password' : 'text'}
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="mb-3">
            <Button
              size="sm"
              variant="light"
              className="d-flex align-items-center justify-content-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="pi pi-eye-slash" />
              ) : (
                <i className="pi pi-eye" />
              )}
            </Button>
          </div>
          <div className="mb-2">
            <Button type="submit" className="btnStyle">
              Se connecter
            </Button>
          </div>
          <div className="linkStyle">
            <div>
              Nouvel utilisateur?{' '}
              <Link to={`/registration`}>Créez votre compte</Link>
            </div>
          </div>
        </Form>
      </Container>
    </div>
  );
}
