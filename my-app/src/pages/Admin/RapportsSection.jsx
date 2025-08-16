// src/pages/admin/RapportsSection.js
import { useState, useEffect } from "react";
import { api } from "../../api/axios";

export default function RapportsSection() {
  const [rapports, setRapports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRapport, setCurrentRapport] = useState({
    _id: null,
    typeRapport: "",
    periode: "",
    contenuPDF: ""
  });

  // Charger les rapports
  useEffect(() => {
    api
      .get("/rapports", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        // Vérifier si la réponse est un tableau ou un objet contenant un tableau
        const data = Array.isArray(res.data) ? res.data : res.data.rapports;
        setRapports(data || []);
      })
      .catch((err) => console.error("❌ Erreur récupération rapports :", err));
  }, []);

  // Ajouter rapport
  const handleAdd = () => {
    api
      .post("/rapports", currentRapport, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setRapports((prev) => [...prev, res.data]);
        setShowAddModal(false);
        setCurrentRapport({ _id: null, typeRapport: "", periode: "", contenuPDF: "" });
      })
      .catch((err) => console.error("❌ Erreur ajout :", err));
  };

  // Modifier rapport
  const handleEdit = () => {
    if (!currentRapport._id) return alert("ID rapport manquant !");
    api
      .put(`/rapports/${currentRapport._id}`, currentRapport, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        setRapports((prev) =>
          prev.map((r) => (r._id === currentRapport._id ? res.data : r))
        );
        setShowEditModal(false);
        setCurrentRapport({ _id: null, typeRapport: "", periode: "", contenuPDF: "" });
      })
      .catch((err) => console.error("❌ Erreur modification :", err));
  };

  // Supprimer rapport
  const handleDelete = (id) => {
    if (!window.confirm("Supprimer ce rapport ?")) return;
    api
      .delete(`/rapports/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then(() => setRapports((prev) => prev.filter((r) => r._id !== id)))
      .catch((err) => console.error("❌ Erreur suppression :", err));
  };

  // Filtrer rapports
  const filteredRapports = Array.isArray(rapports)
    ? rapports.filter(
        (r) =>
          r.typeRapport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.periode?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">📊 Rapports</h2>
        <input
          type="text"
          placeholder="🔍 Recherche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={() => {
            setCurrentRapport({ _id: null, typeRapport: "", periode: "", contenuPDF: "" });
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
            <th className="p-2">Type</th>
            <th>Période</th>
            <th>Date Génération</th>
            <th>PDF</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRapports.length > 0 ? (
            filteredRapports.map((r) => (
              <tr key={r._id} className="border-t hover:bg-gray-100">
                <td>{r.typeRapport}</td>
                <td>{r.periode}</td>
                <td>{r.dateGeneration ? new Date(r.dateGeneration).toLocaleDateString() : "—"}</td>
                <td>
                  {r.contenuPDF ? (
                    <a href={r.contenuPDF} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      📄 Voir PDF
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => {
                      setCurrentRapport(r);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                Aucun rapport trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Ajouter */}
      {showAddModal && (
        <ModalRapport
          titre="➕ Ajouter un rapport"
          rapport={currentRapport}
          setRapport={setCurrentRapport}
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Modal Modifier */}
      {showEditModal && (
        <ModalRapport
          titre="✏️ Modifier le rapport"
          rapport={currentRapport}
          setRapport={setCurrentRapport}
          onSave={handleEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

// Composant Modal réutilisable
function ModalRapport({ titre, rapport, setRapport, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-96">
        <h3 className="text-xl font-bold mb-2">{titre}</h3>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Type de rapport"
          value={rapport.typeRapport}
          onChange={(e) => setRapport({ ...rapport, typeRapport: e.target.value })}
        />
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Période"
          value={rapport.periode}
          onChange={(e) => setRapport({ ...rapport, periode: e.target.value })}
        />
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Lien PDF"
          value={rapport.contenuPDF}
          onChange={(e) => setRapport({ ...rapport, contenuPDF: e.target.value })}
        />
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
