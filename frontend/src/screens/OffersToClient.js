import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import MessageBox from '../components/MessageBox';
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from 'react-bootstrap';
import LoadingBox from '../components/LoadingBox';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        offers: action.payload,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CHOICE_REQUEST':
      return { ...state, loadingChoice: true, successChoice: false };
    case 'CHOICE_SUCCESS':
      return {
        ...state,
        loadingChoice: false,
        successChoice: true,
      };
    case 'CHOICE_FAIL':
      return { ...state, loadingChoice: false };
    case 'CHOICE_RESET':
      return { ...state, loadingChoice: false, successChoice: false };
    default:
      return state;
  }
};

export default function OffersToClient() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [search, setSearch] = useState('');
  const [{ loading, error, offers, loadingChoice, successChoice }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/offer`);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data.filter((offer) => offer.isDisponible),
        });
        // console.log(data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
        console.log(err);
      }
    };

    if (successChoice) {
      dispatch({ type: 'CHOICE_RESET' });
    } else {
      fetchData();
    }
  }, [successChoice]);

  const reserveHundler = async (item) => {
    if (userInfo === null) {
      navigate('/login');
      return;
    }
    if (userInfo.role !== 'CLIENT') {
      toast.info(`You are not allowed to reservation as ${userInfo.role}`);
      return;
    }
    try {
      dispatch({ type: 'CHOICE_REQUEST' });
      await axios.put(
        `/offer/affect/${item.offerId}/${userInfo.userId}`,
        {},
        { headers: { Authorization: `${userInfo.token}` } }
      );
      dispatch({ type: 'CHOICE_SUCCESS' });
      toast.success('Votre Demande a été envoyé');
    } catch (err) {
      toast.error(getError(err));
      console.log(err);
      dispatch({ type: 'CHOICE_FAIL' });
    }
  };

  return (
    <div className="p-5">
      <Helmet>
        <title>Offers</title>
      </Helmet>
      <Container>
        <Row className="mb-4">
          <Col className="d-flex align-items-center justify-content-start">
            <h1>Offres</h1>
          </Col>
        </Row>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : offers.length > 0 ? (
          <>
            <Form>
              <InputGroup className="my-3">
                {/* onChange for search */}
                <Form.Control
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par ville"
                />
              </InputGroup>
            </Form>
            <Row>
              <Col>
                <ListGroup>
                  {offers
                    .filter((offer) => {
                      return search.toLowerCase() === ''
                        ? offer
                        : offer.city
                            .toLowerCase()
                            .includes(search.toLowerCase());
                    })
                    .map((item) => (
                      <ListGroup.Item
                        key={item.offerId}
                        className="mt-3 bg-light border"
                      >
                        <Row>
                          <Col>
                            <p>
                              <strong>Ville</strong>: {item.city} <br />
                              <strong>Adresse:</strong> {item.adress} <br />
                              <strong>Description:</strong> {item.description}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              onClick={() => reserveHundler(item)}
                              className="btnStyle"
                              disabled={loadingChoice}
                            >
                              Demande de reservation
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </Col>
            </Row>
          </>
        ) : (
          <MessageBox>Pas d'offre' pour le moment</MessageBox>
        )}
      </Container>
    </div>
  );
}
