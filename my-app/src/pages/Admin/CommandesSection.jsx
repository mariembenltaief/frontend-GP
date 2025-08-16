import { useState, useEffect } from "react";
import { api } from "../../api/axios";

export default function CommandesSection() {
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCommande, setCurrentCommande] = useState({
    numeroCommande: "",
    dateCommande: "",
    statutCommande: "en attente",
    totalCommande: 0,
    taxesAppliquees: 0,
    adresseLivraison: "",
    modePaiement: "",
  });

  // Charger commandes
  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/commandes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Commandes reçues :", res.data);
        setCommandes(res.data.commandes || res.data); // adapte selon backend
      })
      .catch((err) => console.error("Erreur récupération commandes :", err));
  }, []);

  // Ajouter commande
  const handleAdd = () => {
    const token = localStorage.getItem("token");
    if (!currentCommande.numeroCommande || !currentCommande.totalCommande) {
      return alert("Numéro et total obligatoires !");
    }

    api
      .post("/commandes", currentCommande, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCommandes([...commandes, res.data]);
        setShowAddModal(false);
        setCurrentCommande({
          numeroCommande: "",
          dateCommande: "",
          statutCommande: "en attente",
          totalCommande: 0,
          taxesAppliquees: 0,
          adresseLivraison: "",
          modePaiement: "",
        });
      })
      .catch((err) => {
        console.error("Erreur ajout commande :", err.response?.data || err.message);
        alert("Erreur : " + (err.response?.data?.message || "Impossible d'ajouter la commande"));
      });
  };

  // Modifier commande
  const handleEdit = () => {
    const token = localStorage.getItem("token");
    if (!currentCommande._id) return alert("ID commande manquant !");

    api
      .put(`/commandes/${currentCommande._id}`, currentCommande, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCommandes(commandes.map((c) => (c._id === currentCommande._id ? res.data : c)));
        setShowEditModal(false);
        setCurrentCommande({});
      })
      .catch((err) => console.error(err));
  };

  // Supprimer commande
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!id) return alert("ID commande manquant !");
    if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;

    api
      .delete(`/commandes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setCommandes(commandes.filter((c) => c._id !== id)))
      .catch((err) => {
        console.error(err);
        alert("Erreur lors de la suppression !");
      });
  };

  // Recherche
  const filteredCommandes = commandes.filter(
    (c) =>
      c.numeroCommande?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.statutCommande?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Commandes</h2>
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
            <th className="p-2">Numéro</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Total</th>
            <th>Taxes</th>
            <th>Adresse</th>
            <th>Mode Paiement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCommandes.length > 0 ? (
            filteredCommandes.map((c, index) => (
              <tr key={c._id || index} className="border-t hover:bg-gray-100">
                <td className="p-2">{c.numeroCommande}</td>
                <td>{c.dateCommande ? new Date(c.dateCommande).toLocaleDateString() : ""}</td>
                <td>{c.statutCommande}</td>
                <td>{c.totalCommande}</td>
                <td>{c.taxesAppliquees}</td>
                <td>{c.adresseLivraison}</td>
                <td>{c.modePaiement}</td>
                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => {
                      setCurrentCommande(c);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                Aucune commande trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Ajouter une commande</h3>
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Numéro"
              value={currentCommande.numeroCommande}
              onChange={(e) => setCurrentCommande({ ...currentCommande, numeroCommande: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Date"
              type="date"
              value={currentCommande.dateCommande}
              onChange={(e) => setCurrentCommande({ ...currentCommande, dateCommande: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Total"
              type="number"
              value={currentCommande.totalCommande}
              onChange={(e) => setCurrentCommande({ ...currentCommande, totalCommande: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Taxes"
              type="number"
              value={currentCommande.taxesAppliquees}
              onChange={(e) => setCurrentCommande({ ...currentCommande, taxesAppliquees: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Adresse"
              value={currentCommande.adresseLivraison}
              onChange={(e) => setCurrentCommande({ ...currentCommande, adresseLivraison: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Mode Paiement"
              value={currentCommande.modePaiement}
              onChange={(e) => setCurrentCommande({ ...currentCommande, modePaiement: e.target.value })}
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
            <h3 className="text-xl font-bold mb-2">Modifier la commande</h3>
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Numéro"
              value={currentCommande.numeroCommande}
              onChange={(e) => setCurrentCommande({ ...currentCommande, numeroCommande: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Date"
              type="date"
              value={currentCommande.dateCommande}
              onChange={(e) => setCurrentCommande({ ...currentCommande, dateCommande: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Total"
              type="number"
              value={currentCommande.totalCommande}
              onChange={(e) => setCurrentCommande({ ...currentCommande, totalCommande: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Taxes"
              type="number"
              value={currentCommande.taxesAppliquees}
              onChange={(e) => setCurrentCommande({ ...currentCommande, taxesAppliquees: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Adresse"
              value={currentCommande.adresseLivraison}
              onChange={(e) => setCurrentCommande({ ...currentCommande, adresseLivraison: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Mode Paiement"
              value={currentCommande.modePaiement}
              onChange={(e) => setCurrentCommande({ ...currentCommande, modePaiement: e.target.value })}
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
