import './App.css';
import './components/navbar.css'
import Home from './components/home';
import Navbar from './components/navbar'
import Sidemenu from './components/sidemenu';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className='Applayout'>
        {/* <Sidemenu className='Sidemenu' /> */}
        <Home />
      </div>
    </div>
  );
}

export default App;
