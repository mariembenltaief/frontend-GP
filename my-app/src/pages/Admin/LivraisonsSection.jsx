import { useState, useEffect } from "react";
import { api } from "../../api/axios";

export default function LivraisonsSection() {
  const [livraisons, setLivraisons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLivraison, setCurrentLivraison] = useState({
    dateExpedition: "",
    dateLivraisonPrevue: "",
    dateLivraisonEffective: "",
    statutLivraison: "en attente",
    notesLivreur: "",
    signatureClient: "",
  });

  // Charger livraisons
  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/livraisons", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Livraisons reçues :", res.data);
        setLivraisons(res.data.livraisons || res.data);
      })
      .catch((err) => console.error("Erreur récupération livraisons :", err));
  }, []);

  // Ajouter livraison
  const handleAdd = () => {
    const token = localStorage.getItem("token");
    api
      .post("/livraisons", currentLivraison, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLivraisons([...livraisons, res.data]);
        setShowAddModal(false);
        setCurrentLivraison({
          dateExpedition: "",
          dateLivraisonPrevue: "",
          dateLivraisonEffective: "",
          statutLivraison: "en attente",
          notesLivreur: "",
          signatureClient: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur ajout livraison");
      });
  };

  // Modifier livraison
  const handleEdit = () => {
    const token = localStorage.getItem("token");
    if (!currentLivraison._id) return alert("ID livraison manquant !");
    api
      .put(`/livraisons/${currentLivraison._id}`, currentLivraison, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLivraisons(livraisons.map((l) => (l._id === currentLivraison._id ? res.data : l)));
        setShowEditModal(false);
        setCurrentLivraison({});
      })
      .catch((err) => console.error(err));
  };

  // Supprimer livraison
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Supprimer cette livraison ?")) return;
    api
      .delete(`/livraisons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setLivraisons(livraisons.filter((l) => l._id !== id)))
      .catch((err) => console.error(err));
  };

  // Filtrer
  const filteredLivraisons = livraisons.filter(
    (l) =>
      l.statutLivraison?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.notesLivreur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Livraisons</h2>
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Ajouter
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date Expédition</th>
            <th>Date Prévue</th>
            <th>Date Effective</th>
            <th>Statut</th>
            <th>Notes Livreur</th>
            <th>Signature Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLivraisons.length > 0 ? (
            filteredLivraisons.map((l, index) => (
              <tr key={l._id || index} className="border-t hover:bg-gray-100">
                <td>{l.dateExpedition ? new Date(l.dateExpedition).toLocaleDateString() : ""}</td>
                <td>{l.dateLivraisonPrevue ? new Date(l.dateLivraisonPrevue).toLocaleDateString() : ""}</td>
                <td>{l.dateLivraisonEffective ? new Date(l.dateLivraisonEffective).toLocaleDateString() : ""}</td>
                <td>{l.statutLivraison}</td>
                <td>{l.notesLivreur}</td>
                <td>{l.signatureClient}</td>
                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => {
                      setCurrentLivraison(l);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(l._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                Aucune livraison trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Ajouter une livraison</h3>
            <input
              className="border p-2 mb-2 w-full"
              type="date"
              value={currentLivraison.dateExpedition}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, dateExpedition: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              type="date"
              value={currentLivraison.dateLivraisonPrevue}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, dateLivraisonPrevue: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Notes Livreur"
              value={currentLivraison.notesLivreur}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, notesLivreur: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Signature Client"
              value={currentLivraison.signatureClient}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, signatureClient: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
                Ajouter
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Modifier la livraison</h3>
            <input
              className="border p-2 mb-2 w-full"
              type="date"
              value={currentLivraison.dateExpedition}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, dateExpedition: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              type="date"
              value={currentLivraison.dateLivraisonPrevue}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, dateLivraisonPrevue: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Notes Livreur"
              value={currentLivraison.notesLivreur}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, notesLivreur: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Signature Client"
              value={currentLivraison.signatureClient}
              onChange={(e) => setCurrentLivraison({ ...currentLivraison, signatureClient: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded">
                Modifier
              </button>
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
