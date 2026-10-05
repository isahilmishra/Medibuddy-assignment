import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import DetailPage from './pages/DetailPage'

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/medicine/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
