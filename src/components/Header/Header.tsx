import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Netflix from "../../assets/netflix.png";

// Importiamo il context
import { useFavorites } from "../../context/FavoriteContext";

const Header = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // Otteniamo i preferiti dal context
  const { favorites } = useFavorites();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?query=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black shadow-md z-[1000] py-3.5 px-5">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-5 md:gap-5">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Netflix} alt="Netflix Logo" className="w-10 h-auto" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto md:ml-auto">
          <nav className="flex flex-wrap justify-center gap-5 md:gap-5">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `no-underline text-white text-base px-2.5 py-1.5 rounded transition-colors duration-200 ${
                  isActive ? 'bg-red-600' : 'hover:bg-red-600'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/serie-tv" 
              className={({ isActive }) => 
                `no-underline text-white text-base px-2.5 py-1.5 rounded transition-colors duration-200 ${
                  isActive ? 'bg-red-600' : 'hover:bg-red-600'
                }`
              }
            >
              Serie TV
            </NavLink>
            <NavLink 
              to="/movies" 
              className={({ isActive }) => 
                `no-underline text-white text-base px-2.5 py-1.5 rounded transition-colors duration-200 ${
                  isActive ? 'bg-red-600' : 'hover:bg-red-600'
                }`
              }
            >
              Film
            </NavLink>
            <NavLink 
              to="/preferiti" 
              className={({ isActive }) => 
                `no-underline text-white text-base px-2.5 py-1.5 rounded transition-colors duration-200 ${
                  isActive ? 'bg-red-600' : 'hover:bg-red-600'
                }`
              }
            >
              Preferiti {favorites.length > 0 && `(${favorites.length})`}
            </NavLink>
          </nav>
          <form onSubmit={handleSubmit} className="flex items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Cerca film o serie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-3 py-1.5 rounded-lg border-none outline-none text-sm w-full md:w-[180px] focus:md:w-[250px] transition-all duration-300"
            />
          </form>

        </div>
      </div>
    </header>
  );
};

export default Header;