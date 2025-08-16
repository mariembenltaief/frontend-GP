// src/pages/Admin/AlertesSection.jsx
import { useState, useEffect } from "react";
import { api } from "../../api/axios";

export default function AlertesSection() {
  const [alertes, setAlertes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAlerte, setCurrentAlerte] = useState({
    _id: null,
    idProduit: "",
    seuilMinimum: 0,
    dateAlerte: "",
    statutAlerte: "active"
  });

  // Charger les alertes
  useEffect(() => {
    api
      .get("/alertesstock", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(res => setAlertes(Array.isArray(res.data) ? res.data : res.data.alertes || []))
      .catch(err => console.error("❌ Erreur récupération alertes :", err));
  }, []);

  // Charger les produits pour le select
  useEffect(() => {
    api.get("/produits")
      .then(res => setProduits(res.data || []))
      .catch(err => console.error("❌ Erreur récupération produits :", err));
  }, []);

  // Ajouter alerte
  const handleAdd = () => {
    if (!currentAlerte.idProduit || !currentAlerte.seuilMinimum) {
      return alert("Veuillez remplir le produit et le seuil minimum !");
    }

    const newAlerte = {
      idProduit: currentAlerte.idProduit,
      seuilMinimum: currentAlerte.seuilMinimum,
      dateAlerte: currentAlerte.dateAlerte || undefined,
      statutAlerte: currentAlerte.statutAlerte
    };

    api.post("/alertesstock", newAlerte, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setAlertes(prev => [...prev, res.data]);
      setShowAddModal(false);
      setCurrentAlerte({ _id: null, idProduit: "", seuilMinimum: 0, dateAlerte: "", statutAlerte: "active" });
    })
    .catch(err => console.error("❌ Erreur ajout :", err));
  };

  // Modifier alerte
  const handleEdit = () => {
    if (!currentAlerte._id) return alert("ID alerte manquant !");
    api.put(`/alertesstock/${currentAlerte._id}`, currentAlerte, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setAlertes(prev => prev.map(a => (a._id === currentAlerte._id ? res.data : a)));
      setShowEditModal(false);
      setCurrentAlerte({ _id: null, idProduit: "", seuilMinimum: 0, dateAlerte: "", statutAlerte: "active" });
    })
    .catch(err => console.error("❌ Erreur modification :", err));
  };

  // Supprimer alerte
  const handleDelete = (id) => {
    if (!window.confirm("Supprimer cette alerte ?")) return;
    api.delete(`/alertesstock/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(() => setAlertes(prev => prev.filter(a => a._id !== id)))
    .catch(err => console.error("❌ Erreur suppression :", err));
  };

  // Filtrer alertes
  const filteredAlertes = Array.isArray(alertes)
    ? alertes.filter(a => {
        const produitNom = typeof a.idProduit === "string" ? a.idProduit : (a.idProduit?.nom || "");
        return produitNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (a.statutAlerte || "").toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">⚠️ Alertes de stock</h2>
        <input
          type="text"
          placeholder="🔍 Recherche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => {
            setCurrentAlerte({ _id: null, idProduit: "", seuilMinimum: 0, dateAlerte: "", statutAlerte: "active" });
            setShowAddModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ➕ Ajouter
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Produit</th>
            <th>Seuil Minimum</th>
            <th>Date Alerte</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlertes.length > 0 ? (
            filteredAlertes.map(a => {
              const produitNom = typeof a.idProduit === "string" ? a.idProduit : (a.idProduit?.nom || "");
              return (
                <tr key={a._id} className="border-t hover:bg-gray-100">
                  <td>{produitNom}</td>
                  <td>{a.seuilMinimum}</td>
                  <td>{a.dateAlerte ? new Date(a.dateAlerte).toLocaleDateString() : "—"}</td>
                  <td>{a.statutAlerte}</td>
                  <td className="flex gap-2 p-2">
                    <button
                      onClick={() => {
                        setCurrentAlerte(a);
                        setShowEditModal(true);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                Aucune alerte trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modals */}
      {showAddModal && (
        <ModalAlerte
          titre="➕ Ajouter une alerte"
          alerte={currentAlerte}
          setAlerte={setCurrentAlerte}
          produits={produits}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEditModal && (
        <ModalAlerte
          titre="✏️ Modifier l'alerte"
          alerte={currentAlerte}
          setAlerte={setCurrentAlerte}
          produits={produits}
          onSave={handleEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

// Modal réutilisable
function ModalAlerte({ titre, alerte, setAlerte, onSave, onClose, produits }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-96">
        <h3 className="text-xl font-bold mb-2">{titre}</h3>

        <select
          className="border p-2 mb-2 w-full"
          value={alerte.idProduit || ""}
          onChange={e => setAlerte({ ...alerte, idProduit: e.target.value })}
        >
          <option value="">Sélectionner un produit</option>
          {Array.isArray(produits) && produits.map(p => (
            <option key={p._id} value={p._id}>{p.nom}</option>
          ))}
        </select>

        <input
          type="number"
          className="border p-2 mb-2 w-full"
          placeholder="Seuil minimum"
          value={alerte.seuilMinimum || ""}
          onChange={e => setAlerte({ ...alerte, seuilMinimum: Number(e.target.value) })}
        />

        <input
          type="date"
          className="border p-2 mb-2 w-full"
          value={alerte.dateAlerte || ""}
          onChange={e => setAlerte({ ...alerte, dateAlerte: e.target.value })}
        />

        <select
          className="border p-2 mb-2 w-full"
          value={alerte.statutAlerte || "active"}
          onChange={e => setAlerte({ ...alerte, statutAlerte: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="résolue">Résolue</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onSave} className="bg-green-600 text-white px-4 py-2 rounded">
            {titre.includes("Ajouter") ? "Ajouter" : "Modifier"}
          </button>
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
