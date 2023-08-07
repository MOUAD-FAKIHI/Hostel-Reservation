import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store } from '../Store';
import HosResLogo from'../assets/logo/HOSRES.png'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function NavbarComponent() {
  const location = useLocation();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };
  return (
    <>
      <Navbar expand="lg" bg="light" className="navBarStyle" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className='d-flex align-items-center justify-content-center'>
              <img
                alt="PMasteryLogo"
                src={HosResLogo}
                width="100px"
                height="auto"
                className="d-inline-block align-top"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <i className="pi pi-bars"></i>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto  w-100  justify-content-end">
              {userInfo ? (
                <NavDropdown
                  title={
                    <span>
                      <i
                        className="pi pi-user"
                        style={{ color: '#708090' }}
                      ></i>{' '}
                      {`${userInfo.name}`}
                    </span>
                  }
                  id="basic-nav-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Se déconnecter
                  </Link>
                </NavDropdown>
              ) : location.pathname === '/' ? (
                <Link className="nav-link" to="/registration">
                  S'inscrire
                </Link>
              ) : (
                <Link className="nav-link" to="/">
                  Se connecter
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {userInfo && (
        <>
          <Navbar expand="lg" className="userNavBarStyle" variant="dark">
            <Container>
              <Navbar.Toggle className="w-100" aria-controls="user-navbar-nav">
                <i className="pi pi-arrow-circle-down"></i>
              </Navbar.Toggle>
              <Navbar.Collapse id="user-navbar-nav">
                <Nav className="text-center w-100 d-flex justify-content-center">
                  <Nav.Item className="ms-3 me-3">
                    <LinkContainer to="/home">
                      <Nav.Link>Accueil</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  {userInfo.role === 'ADMIN' && (
                    <>
                      <Nav.Item className="ms-3 me-3">
                        <LinkContainer to="/users-list">
                          <Nav.Link>Utilisateurs</Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                    </>
                  )}
                  {userInfo.role === 'PROVIDER' && (
                    <Nav.Item className="ms-3 me-3">
                      <LinkContainer to="/my-offers">
                        <Nav.Link>Mes offres</Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                  )}
                  {userInfo.role === 'CLIENT' && (
                    <Nav.Item className="ms-3 me-3">
                      <LinkContainer to="/offres">
                        <Nav.Link>Liste des offres</Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </>
      )}
    </>
  );
}
