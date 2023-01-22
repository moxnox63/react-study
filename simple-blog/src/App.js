import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import ListPage from './pages/ListPage';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<ListPage />} />
          <Route path="/blogs/create" element={<CreatePage />} />
          <Route path="/blogs/edit" element={<EditPage />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;