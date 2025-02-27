import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import { Provider } from 'react-redux';
import store, {persistor} from './redux/store';//thêm store, lưu thêm vào localStorage
import { PersistGate } from 'redux-persist/integration/react';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        {/* GlobalStyles cho toan du an */}
          <GlobalStyles>
            <App />
          </GlobalStyles>
      </React.StrictMode>
   </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
