import React from 'react';
import Dashboard from './pages/dashboard';
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
  render() {
    return(
      <div>
        <p><Dashboard/></p>
      </div>
    );
  } 
}

export default App;