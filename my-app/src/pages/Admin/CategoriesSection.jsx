import { useState, useEffect } from "react";
import { api } from "../../api/axios";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    nomCategorie: "",
    descriptionCategorie: "",
    typeCategorie: "",
    imageCategorie: "",
  });

  // Charger toutes les catégories
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data.categories || res.data))
      .catch((err) => console.error(err));
  }, []);

  // Ajouter une catégorie
  const handleAdd = () => {
    const { nomCategorie } = currentCategory;
    if (!nomCategorie) return alert("Le nom de la catégorie est obligatoire !");

    api
      .post("/categories", currentCategory)
      .then((res) => {
        setCategories([...categories, res.data]);
        setShowAddModal(false);
        setCurrentCategory({ nomCategorie: "", descriptionCategorie: "", typeCategorie: "", imageCategorie: "" });
      })
      .catch((err) => {
        console.error("Erreur ajout catégorie :", err.response?.data || err.message);
        alert("Erreur : " + (err.response?.data?.message || "Impossible d'ajouter la catégorie"));
      });
  };

  // Modifier une catégorie
  const handleEdit = () => {
    if (!currentCategory._id) return alert("ID catégorie manquant !");
    api
      .put(`/categories/${currentCategory._id}`, currentCategory)
      .then((res) => {
        setCategories(categories.map(c => c._id === currentCategory._id ? res.data : c));
        setShowEditModal(false);
        setCurrentCategory({ nomCategorie: "", descriptionCategorie: "", typeCategorie: "", imageCategorie: "" });
      })
      .catch((err) => console.error(err));
  };

  // Supprimer une catégorie
  const handleDelete = (id) => {
    if (!id) return alert("ID catégorie manquant !");
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    api
      .delete(`/categories/${id}`)
      .then(() => setCategories(categories.filter(c => c._id !== id)))
      .catch((err) => {
        console.error(err);
        alert("Erreur lors de la suppression !");
      });
  };

  // Filtrage pour la recherche
  const filteredCategories = categories.filter(c =>
    c.nomCategorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.typeCategorie?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header avec recherche et bouton Ajouter */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Catégories</h2>
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">➕ Ajouter</button>
      </div>

      {/* Table catégories */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nom</th>
            <th>Description</th>
            <th>Type</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((c, index) => (
            <tr key={c._id || index} className="border-t">
              <td className="p-2">{c.nomCategorie || ""}</td>
              <td>{c.descriptionCategorie || ""}</td>
              <td>{c.typeCategorie || ""}</td>
              <td>{c.imageCategorie ? <img src={c.imageCategorie} alt={c.nomCategorie} className="h-10 w-10 object-cover" /> : ""}</td>
              <td className="flex gap-2 p-2">
                <button
                  onClick={() => { setCurrentCategory(c); setShowEditModal(true); }}
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
          ))}
        </tbody>
      </table>

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-xl font-bold mb-2">Ajouter une catégorie</h3>
            <input className="border p-2 mb-2 w-full" placeholder="Nom" value={currentCategory.nomCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, nomCategorie: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Description" value={currentCategory.descriptionCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, descriptionCategorie: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Type" value={currentCategory.typeCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, typeCategorie: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="URL Image" value={currentCategory.imageCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, imageCategorie: e.target.value })}/>

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
            <h3 className="text-xl font-bold mb-2">Modifier la catégorie</h3>
            <input className="border p-2 mb-2 w-full" placeholder="Nom" value={currentCategory.nomCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, nomCategorie: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Description" value={currentCategory.descriptionCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, descriptionCategorie: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="Type" value={currentCategory.typeCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, typeCategorie: e.target.value })}/>
            <input className="border p-2 mb-2 w-full" placeholder="URL Image" value={currentCategory.imageCategorie || ""} onChange={e => setCurrentCategory({ ...currentCategory, imageCategorie: e.target.value })}/>

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
