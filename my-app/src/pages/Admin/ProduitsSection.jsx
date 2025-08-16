import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import Pagination from '../../components/Pagination';

export default function ProduitsSection() {
  const [produits, setProduits] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduit, setCurrentProduit] = useState({ nom: '', description: '', prix: '', quantiteStock: 0, typeProduit: '', imageURL: '', statutProduit: 'disponible' });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = () => {
    api.get('/produits')
      .then(res => setProduits(res.data.produits))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    api.delete(`/produits/${id}`)
      .then(() => setProduits(produits.filter(p => p._id !== id)))
      .catch(err => console.error(err));
  };

  const handleAdd = () => {
    if (!currentProduit.nom || !currentProduit.prix) {
      alert("Nom et prix obligatoires !");
      return;
    }

    api.post('/produits', { 
      ...currentProduit, 
      prix: Number(currentProduit.prix), 
      quantiteStock: Number(currentProduit.quantiteStock) 
    })
    .then(res => {
      setProduits([...produits, res.data]);
      setShowAddModal(false);
      setCurrentProduit({ nom: '', description: '', prix: '', quantiteStock: 0, typeProduit: '', imageURL: '', statutProduit: 'disponible' });
    })
    .catch(err => console.error(err));
  };

  const handleEdit = () => {
    if (!currentProduit.nom || !currentProduit.prix) {
      alert("Nom et prix obligatoires !");
      return;
    }

    api.put(`/produits/${currentProduit._id}`, { 
      ...currentProduit, 
      prix: Number(currentProduit.prix), 
      quantiteStock: Number(currentProduit.quantiteStock) 
    })
    .then(res => {
      setProduits(produits.map(p => p._id === currentProduit._id ? res.data : p));
      setShowEditModal(false);
      setCurrentProduit({ nom: '', description: '', prix: '', quantiteStock: 0, typeProduit: '', imageURL: '', statutProduit: 'disponible' });
    })
    .catch(err => console.error(err));
  };

  const filtered = produits.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Produits</h2>
        <button type="button" onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">➕ Ajouter</button>
      </div>

      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border w-full rounded"
      />

      <table className="w-full border border-gray-300 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedItems.map(p => (
            <tr key={p._id} className="border-t hover:bg-gray-50">
              <td className="p-2">{p.nom}</td>
              <td>{p.description}</td>
              <td>{p.prix} €</td>
              <td>{p.quantiteStock}</td>
              <td>{p.statutProduit}</td>
              <td className="flex gap-2 p-2">
                <button type="button" onClick={() => { setCurrentProduit(p); setShowEditModal(true); }} className="bg-yellow-500 text-white px-2 py-1 rounded">✏️</button>
                <button type="button" onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-2 py-1 rounded">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Ajouter un produit</h3>
            <input className="border p-2 mb-2 w-full" placeholder="Nom" value={currentProduit.nom} onChange={e => setCurrentProduit({ ...currentProduit, nom: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Description" value={currentProduit.description} onChange={e => setCurrentProduit({ ...currentProduit, description: e.target.value })}/>
            <input type="number" className="border p-2 mb-2 w-full" placeholder="Prix" value={currentProduit.prix} onChange={e => setCurrentProduit({ ...currentProduit, prix: e.target.value })}/>
            <input type="number" className="border p-2 mb-2 w-full" placeholder="Quantité" value={currentProduit.quantiteStock} onChange={e => setCurrentProduit({ ...currentProduit, quantiteStock: e.target.value })}/>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">Ajouter</button>
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded border">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Modifier le produit</h3>
            <input className="border p-2 mb-2 w-full" placeholder="Nom" value={currentProduit.nom} onChange={e => setCurrentProduit({ ...currentProduit, nom: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Description" value={currentProduit.description} onChange={e => setCurrentProduit({ ...currentProduit, description: e.target.value })}/>
            <input type="number" className="border p-2 mb-2 w-full" placeholder="Prix" value={currentProduit.prix} onChange={e => setCurrentProduit({ ...currentProduit, prix: e.target.value })}/>
            <input type="number" className="border p-2 mb-2 w-full" placeholder="Quantité" value={currentProduit.quantiteStock} onChange={e => setCurrentProduit({ ...currentProduit, quantiteStock: e.target.value })}/>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">Modifier</button>
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded border">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
