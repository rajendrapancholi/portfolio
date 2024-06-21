import { ToastContainer as BaseToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toaster() {
  return (
    <BaseToastContainer
      position="top-center"
      theme="dark"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
