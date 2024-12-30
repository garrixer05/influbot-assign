import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <GoogleOAuthProvider clientId="411013056925-j4mg834ik5aja992dkarmjl6ofpstk7g.apps.googleusercontent.com">
      <Provider store={store}>

        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
