import { Container, ToastContainer } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './screens/LoginScreen';
import RegistrationScree from './screens/RegistrationScree';
import HomeScreen from './screens/HomeScreen';
import AdminRoute from './components/AdminRoute';
import ProviderRoute from './components/ProviderRoute';
import UsersScreen from './screens/UsersScreen';
import MyOffersScreen from './screens/MyOffersScreen';
import CreateOfferScreen from './screens/CreateOfferScreen';
import OffersToClient from './screens/OffersToClient';

function App() {
  return (
    <BrowserRouter>
      <div className="site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <NavbarComponent />
        </header>
        <main>
          <Container fluid="md" className="p-0">
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/registration" element={<RegistrationScree />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users-list"
                element={
                  <AdminRoute>
                    <UsersScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/my-offers"
                element={
                  <ProviderRoute>
                    <MyOffersScreen />
                  </ProviderRoute>
                }
              />
              <Route
                path="/create-offer"
                element={
                  <ProviderRoute>
                    <CreateOfferScreen />
                  </ProviderRoute>
                }
              />
              <Route path="/" element={<OffersToClient />} />
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
