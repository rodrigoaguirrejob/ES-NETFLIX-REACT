import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
      <h1 className="text-8xl font-extrabold mb-6">404</h1>
      <h2 className="text-3xl font-bold mb-4">Pagina non trovata</h2>
      <p className="text-gray-400 mb-8">
        La pagina che stai cercando non esiste o è stata rimossa.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
      >
        Torna alla Home
      </button>
    </div>
  );
}
