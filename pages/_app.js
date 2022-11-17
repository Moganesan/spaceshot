import "../styles/globals.css";
import { Provider } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import { ToastPortal } from "../components/ToastPortal";
import store from "../store/store";
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ToastPortal ref={toastRef} autoClose={true} />
        <Component {...pageProps} />
      </ToastProvider>
    </Provider>
  );
}

export default MyApp;
