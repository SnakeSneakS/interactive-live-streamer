import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react"

import MyNavBar from './components/pages/Base/NavBar';
import MyRouter from './components/pages/Base/Router';
import MyNavBarInRouter from 'components/pages/Base/NavBarInRouter';
import Footer from 'components/pages/Base/Footer';


function App() {

  return (
    <div className="App">
      <div>
        <main>
          <MyRouter before={<MyNavBarInRouter />} />
        </main>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
