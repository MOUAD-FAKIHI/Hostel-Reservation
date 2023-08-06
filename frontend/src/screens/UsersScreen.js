import Axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { Button, Tab, Table, Tabs } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, lading: true };
    case 'FETCH_SUCCESS':
      return { ...state, users: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function UsersScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await Axios.get('/user/allUsers', {
          headers: { Authorization: `${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        // console.log(data);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete, userInfo]);

  

  const deleteHandler = async (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimmer ce compte?`)) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/user/${user.userId}`, {
          headers: { Authorization: `${userInfo.token}` },
        });
        toast.success('Étudiant  supprimé avec succès');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <div className="p-5">
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Utilisateurs</h1>
      {loadingDelete && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Tabs
          defaultActiveKey="Les fournisseurs de services"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab
            eventKey="Les fournisseurs de services"
            title="Les fournisseurs de services"
          >
            {users.filter((user) => user.role === 'PROVIDER').length > 0 ? (
              <Table striped responsive size="sm">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.role === 'PROVIDER')
                    .map((user) => (
                      <tr key={user.userId}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => deleteHandler(user)}
                          >
                            Supprimmer
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            ) : (
              <MessageBox>Pas de demandes</MessageBox>
            )}
          </Tab>  
          <Tab
            eventKey="Les clients"
            title="Les clients"
          >
            {users.filter((user) => user.role === 'CLIENT').length > 0 ? (
              <Table striped responsive size="sm">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.role === 'CLIENT')
                    .map((user) => (
                      <tr key={user.userId}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => deleteHandler(user)}
                          >
                            Supprimmer
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            ) : (
              <MessageBox>Pas de demandes</MessageBox>
            )}
          </Tab>
          
        </Tabs>
      )}
    </div>
  );
}
