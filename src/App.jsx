import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material';
import CartContext from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './Home.jsx'
import Marketplace from './Marketplace.jsx'

function App() {

  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
  }

  console.log(cartItems);

  return (
    <CartContext.Provider value={{ cartItems, handleAddToCart }}>
      <div>
        <Navbar />
        <Container component="main" sx={{ py: 4 }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/marketplace' element={<Marketplace />} />
            <Route path='*' element={<h1>Page not found</h1>} />
          </Routes>
        </Container>
      </div>
    </CartContext.Provider>
  )
}

export default App