import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from 'reportWebVitals'
import { ApolloProvider } from '@apollo/client'

import 'antd/dist/antd.min.css'


import 'index.css'
import App from 'App'
import client from 'apollo';
import AppContextProvider from 'AppContext'
import './config';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('ORg4AjUWIQA/Gnt2VVhkQlFacl1JXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRjUX9Wc3VVRGVbU0c=');

ReactDOM.render(
  <ApolloProvider client={client}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </ApolloProvider>,
  document.getElementById('root')
)

reportWebVitals()
