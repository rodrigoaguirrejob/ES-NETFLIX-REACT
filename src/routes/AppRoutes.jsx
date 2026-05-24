import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Layout from "../components/Layout/layout.jsx";

import Home from "../pages/Home/home.jsx";
import Movies from "../pages/Movies/movies.jsx";
import Serietv from "../pages/Serietv/serietv.jsx";
import Search from "../pages/Search/search.jsx";
import Details from "../pages/Details/details.jsx";
import Favorites from "../pages/Favorites/Favorites.jsx";
import NotFound from "../pages/NotFound/notfound.jsx";

import FavoritesProvider from "../context/FavoriteContext.jsx";

// ScrollToTop per resettare lo scroll ad ogni route
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppRoutes = () => {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/serie-tv" element={<Serietv />} />
            <Route path="/search" element={<Search />} />
            <Route path="/details/:type/:id" element={<Details />} />
            <Route path="/preferiti" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  );
};

export default AppRoutes;
