import { Container, ToastContainer } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './screens/LoginScreen';
import RegistrationScree from './screens/RegistrationScree';
import HomeScreen from './screens/HomeScreen';
import AdminRoute from './components/ProtectedRoute';
import UsersScreen from './screens/UsersScreen';

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
              <Route path="/" element={<LoginScreen />} />
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
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
