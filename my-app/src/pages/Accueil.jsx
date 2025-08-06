import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import CardProduit from '../components/CardProduit';

export default function Accueil() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/produits')
      .then(res => {
        console.log('Réponse API produits:', res.data);
        setProduits(res.data.produits);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6">
      {/* Titre */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
          📦 Welcome to <span className="text-pink-600">Maryem’s Product Manager</span>
        </h1>
        <p className="text-gray-600 text-xl mt-4 italic">
          Simplify your inventory, amplify your control.
        </p>
      </div>

      {/* Affichage du chargement */}
      {loading ? (
        <p className="text-center mt-10">Chargement...</p>
      ) : (
        // Grille des produits
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {produits.map(p => (
            <CardProduit key={p._id} produit={p} />
          ))}
        </div>
      )}
    </div>
  );
}
