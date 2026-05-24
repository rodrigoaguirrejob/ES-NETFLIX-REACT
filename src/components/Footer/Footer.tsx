import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-black text-[#f2f2f2] py-10 px-6 border-t-2 border-red-600">
      <div className="max-w-screen-xl mx-auto mb-10 text-center">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="../../src/assets/netflix.png"
              alt="Netflix Logo"
              className="w-10 h-auto"  
            />
          </Link>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16">
          <Link
            to="/serie-tv"
            className="text-[#d9d9d9] hover:text-red-600 no-underline"
          >
            <h4 className="text-base font-bold">Serie TV</h4>
          </Link>

          <Link
            to="/movies"
            className="text-[#d9d9d9] hover:text-red-600 no-underline"
          >
            <h4 className="text-base font-bold">Film</h4>
          </Link>

          <Link
            to="/preferiti"
            className="text-[#d9d9d9] hover:text-red-600 no-underline"
          >
            <h4 className="text-base font-bold">Preferiti</h4>
          </Link>
        </div>

      </div>

      <div className="text-center border-t border-gray-700 pt-6">
        <p>© {new Date().getFullYear()} Gualtiero e Rodrigo - Tutti i diritti riservati</p>

        <p className="text-sm mt-1 flex items-center justify-center gap-1 text-gray-400">
          Made with <AiFillHeart className="text-red-600" /> using React & TailwindCSS
        </p>

      </div>
    </footer>
  );
};

export default Footer;







