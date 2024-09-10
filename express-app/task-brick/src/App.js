import './App.css';
import AllRoutes from './routes/AllRoutes';
import useAutoLogin from './hooks/useAutoLogin';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  useAutoLogin();

  return (
    <div className="App">
      <AllRoutes />
      {/* Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;

