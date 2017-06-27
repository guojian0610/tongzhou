import React from 'react'
import { render } from 'react-dom';

import Header from './components/Header.jsx'

render(
  <Header name="John" />,
  document.getElementById('container')
);