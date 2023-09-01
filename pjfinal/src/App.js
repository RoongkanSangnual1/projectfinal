
import './App.css';
import Dashboard from './components/dashboard';
import Navbar from './components/navbar'
import Sidemenu from './components/sidemenu';

function App() {
  return (
    <div className="App">
        <Navbar />
     
        <div className='Applayout'>
          <Sidemenu />
          <Dashboard />
        </div>
    </div>
  );
}

export default App;
