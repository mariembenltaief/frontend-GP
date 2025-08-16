// src/pages/Admin/Settings.jsx
import { useState } from "react";
import { api } from "../../api/axios";

export default function Parametre() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");

  const handlePasswordChange = () => {
    if (!password || !confirmPassword) {
      return setMessage("Veuillez remplir tous les champs !");
    }
    if (password !== confirmPassword) {
      return setMessage("Les mots de passe ne correspondent pas !");
    }

    api.put("/users/change-password", { password }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setMessage("Mot de passe mis à jour avec succès !"))
    .catch(err => setMessage("Erreur lors de la mise à jour du mot de passe."));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">⚙️ Parametres</h2>

      {/* Section mot de passe */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Changer le mot de passe</h3>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          className="border p-2 mb-2 w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="border p-2 mb-2 w-full"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordChange}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Mettre à jour
        </button>
        {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
      </div>

      {/* Section notifications */}
      <div>
        <h3 className="font-semibold mb-2">Notifications</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="w-5 h-5"
          />
          Activer les notifications
        </label>
      </div>
    </div>
  );
}
