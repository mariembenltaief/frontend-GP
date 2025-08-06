import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { jwtDecode } from 'jwt-decode';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Remplissez tous les champs');
      return;
    }

    try {
      const res = await api.post('/users/login', { email, password });
      console.log("Réponse du backend :", res.data); // ✅ pour debug

      const token = res.data.token;

      if (!token) {
        setError('Email ou mot de passe incorrect');
        return;
      }

      localStorage.setItem('token', token);

      const decoded = jwtDecode(token); // ✅ pas .default
      const role = decoded.role;
      console.log("Utilisateur connecté, rôle :", role);

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/accueil');
      }

    } catch (err) {
      console.error("Erreur dans la requête :", err); // ✅ voir si une vraie erreur
      setError('Erreur lors de la connexion');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="flex bg-blue-100 rounded shadow-md w-full max-w-4xl overflow-hidden">

        {/* Image à gauche */}
        <div className="w-1/3 hidden md:block">
          <img
            src="/Images/Login.png"
            alt="Connexion"
            className="w-full h-full object-contain p-4"
          />
        </div>

        {/* Formulaire à droite */}
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 underline">
            Connexion
          </h2>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 text-lg border border-black rounded"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                placeholder="Mot de passe"
                className="w-full p-3 text-lg border border-black rounded"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 text-lg rounded hover:bg-blue-600 transition"
              >
                Se connecter
              </button>
            </div>

            <div>
              <button
                type="button"
                className="w-full bg-gray-600 text-white py-3 text-lg rounded hover:bg-gray-700 transition"
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
