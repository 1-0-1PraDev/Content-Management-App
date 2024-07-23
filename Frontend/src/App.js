import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostPage from "./pages/PostPage";
import { UserContextProvider } from "./Context/UserContext";
import CreatePost from "./pages/CreatePost";
import ProtectedRoute from "./ProtectedRoute";
import EditPost from "./pages/EditPost";
import FavoritePost from "./pages/FavoritePost";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/create" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
          } />
           <Route path="/edit/:id" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
          } />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/posts/:userId/favorite-posts" element={
              <ProtectedRoute>
                <FavoritePost />
              </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
