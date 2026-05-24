import React, { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const STORAGE_KEY = "favorites_v1";
  const [favorites, setFavorites] = useState([]);

  // Carica da localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFavorites(JSON.parse(saved));
    } catch (err) {
      console.error("Errore parsing favorites da localStorage:", err);
    }
  }, []);

  // Salva su localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error("Errore salvataggio favorites su localStorage:", err);
    }
  }, [favorites]);

  // Sincronizza tra tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addFavorite = (item) => {
    if (!item || !item.id || !item.type) return;
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id && f.type === item.type);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFavorite = (id, type) => {
    setFavorites((prev) => prev.filter((f) => !(f.id === id && f.type === type)));
  };

  const isFavorite = (id, type) => favorites.some((f) => f.id === id && f.type === type);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook per usare il context
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites deve essere usato dentro FavoritesProvider");
  return ctx;
}

export default FavoritesProvider;
