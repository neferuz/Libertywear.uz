
import './App.css';

import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import AllRoute from './Routes/AllRoute';
import { CartProvider } from './Context/CartContext';

function App() {
  return (
    <div className="App">
      <CartProvider>
        <div>
          <Navbar/>
          <AllRoute />
          <Footer/>
        </div>
      </CartProvider>
    </div>
  );
}

export default App;
