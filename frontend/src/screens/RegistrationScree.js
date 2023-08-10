import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';

export default function RegistrationScree() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/home';
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PROVIDER',
  });

  const [showPassword, setShowPassword] = useState(true);
  const firstErrorRef = useRef(null);
  const [errors, setErrors] = useState({});
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (!!errors[field]) setErrors({ ...errors, [field]: null });
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, role } = form;
    const newErrors = {};

    if (!name || name === '') newErrors.name = 'Entrez votre nom';
    else if (name.length < 3 || name.length > 30)
      newErrors.name = 'Le nom doit comporter entre 3 et 30 caractères';
    else if (!/^[A-Za-z ]+$/.test(name))
      newErrors.name = 'Le nom ne doit contenir que des caractères';

    if (!email || email === '') newErrors.email = 'Entrez votre email';
    else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ||
      !email.includes('@')
    )
      newErrors.email = `Format d'email invalide`;
    else if (email.length > 100)
      newErrors.email = `L'email doit comporter au maximum 100 caractères`;

    if (!password || password === '')
      newErrors.password = 'Entrez votre mot de passe';
    else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/.test(password))
      newErrors.password =
        'Le mot de passe doit contenir entre 8 et 20 caractères utilise des minuscules majuscules et des chiffres';

    if (!confirmPassword || confirmPassword === '')
      newErrors.confirmPassword = 'confirmez votre mot de passe';
    else if (confirmPassword !== password)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

    if (!role || role === '') newErrors.role = 'Choisissez votre rôle';

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
      setLoading(true);
      // console.log(form);
      await axios.post('/user', form);
      setLoading(false);
      navigate(redirect || '/login');
    } catch (err) {
      toast.error(getError(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    // Find the first input element with an error
    const firstErrorInput = Object.keys(errors).find(
      (inputName) => errors[inputName]
    );

    // Scroll to the first error element
    if (firstErrorInput) {
      const firstErrorRefElement = document.querySelector(
        `[id=${firstErrorInput}]`
      );
      if (firstErrorRefElement) {
        firstErrorRefElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors]);
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="p-5">
      <Helmet>
        <title>Registration</title>
      </Helmet>
      <Container>
        <Form onSubmit={submitHandler} noValidate>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              isInvalid={!!errors.name}
              disabled={loading}
              ref={errors.name ? firstErrorRef : null}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              isInvalid={!!errors.email}
              disabled={loading}
              ref={errors.email ? firstErrorRef : null}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type={showPassword ? 'password' : 'text'}
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              isInvalid={!!errors.password}
              disabled={loading}
              ref={errors.password ? firstErrorRef : null}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" controlId="confirmPassword">
            <Form.Label>Confirmer le mot de passe</Form.Label>
            <Form.Control
              type={showPassword ? 'password' : 'text'}
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={(e) => setField('confirmPassword', e.target.value)}
              isInvalid={!!errors.confirmPassword}
              disabled={loading}
              ref={errors.confirmPassword ? firstErrorRef : null}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.confirmPassword}
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
          <Form.Group className="mb-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={form.role}
              onChange={(e) => setField('role', e.target.value)}
              isInvalid={!!errors.role}
              disabled={loading}
              ref={errors.role ? firstErrorRef : null}
            >
              <option value="PROVIDER">Service provider</option>
              <option value="CLIENT">Client</option>
            </Form.Select>
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.role}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="mb-3">
            <Button type="submit" disabled={loading} className="btnStyle">
              S'inscrire
            </Button>
            {loading && <LoadingBox />}
          </div>
          <div className="mb-3 linkStyle">
            Vous avez déjà un compte?{' '}
            <Link to={"/login"}>Se connecter</Link>
          </div>
        </Form>
      </Container>
    </div>
  );
}
