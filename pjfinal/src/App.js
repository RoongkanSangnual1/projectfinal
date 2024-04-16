import './App.css';
import Home from './components/home';
import Navbar from './components/navbar'
import Sidemenu from './components/sidemenu';

function App() {
  return (
    <div className="App">
      <Navbar />
      
      <div className='Applayout'>
        <div className='spaceUpApp'></div>
        <Home className='Home' />
  
        <div className='spaceUpApp'></div>
      </div>
      
    </div>
  );
}

export default App;
