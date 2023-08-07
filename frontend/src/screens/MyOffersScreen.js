import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from '../Store';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        providerOffers: action.payload,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function MyOffersScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [offerSelectedAction, setOfferSelectedAction] = useState(null);
  const [{ loading, error, providerOffers }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/offer/${userInfo.userId}`, {
          headers: { Authorization: `${userInfo.token}` },
        });
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
        console.log(data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
        console.log(err);
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="p-5">
      <Helmet>
        <title>Offers</title>
      </Helmet>
      <Container>
        <Row className='mb-4'>
          <Col className='d-flex align-items-center justify-content-start'>
            <h1>Mes offres</h1>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            <LinkContainer to="/create-offer">
              <Button className="btnStyle">Ajouter une nouvelle offre</Button>
            </LinkContainer>
          </Col>
        </Row>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : providerOffers.length > 0 ? (
          <>
            <Row>
              <Col>
                <ListGroup>
                  {providerOffers.map((item) => (
                    <ListGroup.Item
                      key={item.offerId}
                      action
                      onClick={() => setOfferSelectedAction(item)}
                    >
                      <Row>
                        <p>
                          <strong>Ville</strong>: {item.city} <br />
                          <strong>Adresse:</strong> {item.adress} <br />
                          <strong>Description:</strong> {item.description}
                        </p>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col>
                {offerSelectedAction === null ? (
                  <div className="text-center sticky-top removeZindex">
                    <p>Sélectionner une offre</p>
                  </div>
                ) : (
                  <ListGroup variant="flush sticky-top removeZindex">
                    <ListGroup.Item>
                      <p>
                        <strong>Ville</strong>: {offerSelectedAction.city}{' '}
                        <br />
                        <strong>Adresse:</strong> {offerSelectedAction.adress}{' '}
                        <br />
                        <strong>Description:</strong>{' '}
                        {offerSelectedAction.description}
                      </p>
                    </ListGroup.Item>
                  </ListGroup>
                )}
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
