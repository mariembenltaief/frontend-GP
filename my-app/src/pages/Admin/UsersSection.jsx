import { useState, useEffect } from 'react';
import { api } from "../../api/axios";

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    adresse: '',
    password: ''
  });

  // Charger tous les utilisateurs
  useEffect(() => {
    api.get('/users/all')
      .then(res => setUsers(res.data.users || res.data))
      .catch(err => console.error(err));
  }, []);

  // Ajouter un utilisateur
  const handleAdd = () => {
    const { nom, prenom, email, adresse, password } = currentUser;
    if (!nom || !prenom || !email || !adresse || !password) {
      return alert("Tous les champs sont obligatoires !");
    }

    api.post('/users/createUser', currentUser)
      .then(res => {
        setUsers([...users, res.data]);
        setShowAddModal(false);
        setCurrentUser({ nom: '', prenom: '', email: '', adresse: '', password: '' });
      })
      .catch(err => {
        console.error("Erreur ajout utilisateur :", err.response?.data || err.message);
        alert("Erreur : " + (err.response?.data?.message || "Impossible d'ajouter l'utilisateur"));
      });
  };

  // Modifier un utilisateur
  const handleEdit = () => {
    if (!currentUser._id) return alert("ID utilisateur manquant !");
    api.put(`/users/${currentUser._id}`, currentUser)
      .then(res => {
        setUsers(users.map(u => u._id === currentUser._id ? res.data : u));
        setShowEditModal(false);
        setCurrentUser({ nom: '', prenom: '', email: '', adresse: '', password: '' });
      })
      .catch(err => console.error(err));
  };

  // Supprimer un utilisateur
  const handleDelete = (id) => {
    if (!id) return alert("ID utilisateur manquant !");
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    api.delete(`/users/${id}`)
      .then(() => setUsers(users.filter(u => u._id !== id)))
      .catch(err => {
        console.error(err);
        alert("Erreur lors de la suppression !");
      });
  };

  // Filtrage pour la recherche
  const filteredUsers = users.filter(u =>
    u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header avec recherche et bouton Ajouter */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Utilisateurs</h2>
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">➕ Ajouter</button>
      </div>

      {/* Table utilisateurs */}
      <table className="w-full border border-gray-300">
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
          {filteredUsers.map((u, index) => (
            <tr key={u._id || index} className="border-t">
              <td className="p-2">{u.nom || ''}</td>
              <td>{u.prenom || ''}</td>
              <td>{u.email || ''}</td>
              <td>{u.adresse || ''}</td>
              <td className="flex gap-2 p-2">
                <button
                  onClick={() => { setCurrentUser(u); setShowEditModal(true); }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Ajouter un utilisateur</h3>
            <input className="border p-2 mb-2 w-full" placeholder="Nom" value={currentUser.nom || ''} onChange={e => setCurrentUser({ ...currentUser, nom: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Prénom" value={currentUser.prenom || ''} onChange={e => setCurrentUser({ ...currentUser, prenom: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Email" value={currentUser.email || ''} onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Adresse" value={currentUser.adresse || ''} onChange={e => setCurrentUser({ ...currentUser, adresse: e.target.value })}/>
            <input type="password" className="border p-2 mb-2 w-full" placeholder="Mot de passe" value={currentUser.password || ''} onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}/>

            <div className="flex justify-end gap-2">
              <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">Ajouter</button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Modifier l'utilisateur</h3>
            <input className="border p-2 mb-2 w-full" placeholder="Nom" value={currentUser.nom || ''} onChange={e => setCurrentUser({ ...currentUser, nom: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Prénom" value={currentUser.prenom || ''} onChange={e => setCurrentUser({ ...currentUser, prenom: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Email" value={currentUser.email || ''} onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Adresse" value={currentUser.adresse || ''} onChange={e => setCurrentUser({ ...currentUser, adresse: e.target.value })}/>

            <div className="flex justify-end gap-2">
              <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">Modifier</button>
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
