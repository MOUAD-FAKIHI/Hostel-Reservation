import React, { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { Button, Container, Form } from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function CreateOfferScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [loading, setLoading] = useState(false);
  const firstErrorRef = useRef(null);
  const [form, setForm] = useState({
    city: '',
    adress: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (!!errors[field]) setErrors({ ...errors, [field]: null });
  };

  const validateForm = () => {
    const { city, adress, description } = form;
    const newErrors = {};

    if (!city || city === '') newErrors.city = 'Entrez la ville';
    else if (city.length < 3 || city.length > 30)
      newErrors.city = 'La ville doit comporter entre 3 et 30 caractères';

    if (!adress || adress === '') newErrors.adress = "Entrez l'adresse";
    else if (adress.length < 3 || adress.length > 255)
      newErrors.adress = "L'adresse doit comporter entre 3 et 255 caractères";

    if (!description || description === '')
      newErrors.description = 'Entrez la description';
    else if (description.length < 3 || description.length > 500)
      newErrors.description =
        'La description doit comporter entre 3 et 500 caractères';

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
      await axios.post(`/offer/${userInfo.userId}`, form, {
        headers: { Authorization: `${userInfo.token}` },
      });
      setLoading(false);
      navigate('/my-offers');
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

  return (
    <div className="p-5">
      <Helmet>Create offer</Helmet>
      <h1>Créer une nouvelle offre</h1>
      <Container>
        <Form onSubmit={submitHandler} noValidate>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ville</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ville"
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
              isInvalid={!!errors.city}
              disabled={loading}
              ref={errors.city ? firstErrorRef : null}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.city}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="adress">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              type="adress"
              placeholder="Adresse"
              value={form.adress}
              onChange={(e) => setField('adress', e.target.value)}
              isInvalid={!!errors.adress}
              disabled={loading}
              ref={errors.adress ? firstErrorRef : null}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.adress}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              isInvalid={!!errors.description}
              disabled={loading}
              ref={errors.description ? firstErrorRef : null}
            />
            <Form.Control.Feedback className="formErrorMsg" type="invalide">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="mb-3">
            <Button type="submit" disabled={loading} className="btnStyle">
              Créer
            </Button>
            {loading && <LoadingBox />}
          </div>
        </Form>
      </Container>
    </div>
  );
}
