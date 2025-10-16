import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from './pages/loginPage';
import { HomePage } from './pages/HomePage';
import { AddBookPage} from './pages/AddBookPage';
import { BookInfoPage } from './pages/BookInfoPage';
import { EditBookPage } from './pages/EditBookPage';
import { ProfilePage } from './pages/ProfilePage';
import { RecommendationPage } from './pages/RecommendationPage';
import { YourBooksPage } from './pages/YourBooksPage';
import { CreateAccountPage } from './pages/CreateAccountPage';


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  return(
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/addBook" element={<AddBookPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/editBook" element={<EditBookPage />} />
      <Route path="/bookInfo" element={<BookInfoPage />} />
      <Route path="/recommendation" element={<RecommendationPage />} />
      <Route path="/yourBooks" element={<YourBooksPage />} />
      <Route path="/createAccount" element={<CreateAccountPage />} />
    </Routes>
  )
}

export default App
