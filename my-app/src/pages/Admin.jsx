import { useEffect, useState } from 'react';
import { api } from '../api/axios';

export default function Admin() {
  // États pour produits et utilisateurs
  const [produits, setProduits] = useState([]);
  const [users, setUsers] = useState([]);

  // État de chargement (true tant que les deux requêtes ne sont pas terminées)
  const [loadingProduits, setLoadingProduits] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Récupération des produits
  useEffect(() => {
    api.get('/produits')
      .then(res => {
        setProduits(res.data.produits);
        setLoadingProduits(false);
      })
      .catch(err => {
        console.error('Erreur chargement produits :', err);
        setLoadingProduits(false);
      });
  }, []);

 // Récupérer utilisateurs (route protégée)
  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupérer token JWT stocké

    if (!token) {
      setErrorUsers("Token non trouvé, veuillez vous connecter.");
      setLoadingUsers(false);
      return;
    }

    api.get('/users/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => {
        setUsers(res.data.users || res.data);
        setLoadingUsers(false);
      })
      .catch(err => {
        console.error('Erreur chargement utilisateurs :', err);
        if (err.response && err.response.status === 401) {
          setErrorUsers("Non autorisé. Veuillez vous reconnecter.");
        } else {
          setErrorUsers("Erreur lors du chargement des utilisateurs.");
        }
        setLoadingUsers(false);
      });
  }, []);


  // Afficher message de chargement tant qu’au moins une des deux listes n’est pas chargée
  if (loadingProduits || loadingUsers) {
    return <p className="text-center mt-10">Chargement des données...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">

      {/* Titre */}
      <div className="text-center mt-12 mb-10">
        <h1 className="text-4xl font-bold text-blue-700">🔧 Espace Admin</h1>
        <p className="text-gray-600 mt-2">Bienvenue dans l'interface d'administration.</p>
      </div>

      {/* Section Produits */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Gestion des Produits</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Ajouter un produit
          </button>
        </div>
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.nom}</td>
                <td>{p.description}</td>
                <td>{p.prix} €</td>
                <td>
                  <button className="text-blue-600 hover:underline mr-2">✏️ Modifier</button>
                  <button className="text-red-600 hover:underline">🗑️ Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section Utilisateurs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Gestion des Utilisateurs</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Ajouter un utilisateur
          </button>
        </div>
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.nom}</td>
                <td>{u.prenom}</td>
                <td>{u.email}</td>
                <td>{u.adresse}</td>
                <td>
                  <button className="text-blue-600 hover:underline mr-2">✏️ Modifier</button>
                  <button className="text-red-600 hover:underline">🗑️ Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
