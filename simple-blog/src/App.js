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
import ShowPage from './pages/ShowPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<ListPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/blogs/:id" element={<ShowPage />} />
          <Route path="/blogs/create" element={<CreatePage />} />
          <Route path="/blogs/:id/edit" element={<EditPage />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;