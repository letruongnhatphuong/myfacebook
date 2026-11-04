import { Route, Routes } from 'react-router-dom'
import { Container } from '@mui/material';
import Navbar from './components/Navbar'
import Home from './Home.jsx'
import Marketplace from './Marketplace.jsx'

function App() {

  return (
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
  )
}

export default App