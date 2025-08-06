export default function Register() {
  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div className="bg-blue-100 p-8 rounded shadow-md w-full max-w-2xl">
        {/* Titre + Image sur la même ligne */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold underline font-mono text-blue-900">Inscription</h2>
          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
            <img
              src="/Images/Register.png" // 🔄 Mets ton chemin correct ici
              alt="Inscription"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <form>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="pr-4 py-2 font-mono font-bold text-lg " >Nom :</td>
                <td>
                  <input type="text" placeholder="Nom" className="w-full p-2 border  rounded" />
                </td>
              </tr>
              <tr>
                <td className="pr-4 py-2 font-mono font-bold text-lg">Prénom :</td>
                <td>
                  <input type="text" placeholder="Prénom" className="w-full p-2 border rounded" />
                </td>
              </tr>
              <tr>
                <td className="pr-4 py-2 font-mono font-bold text-lg">Email :</td>
                <td>
                  <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
                </td>
              </tr>
              <tr>
                <td className="pr-4 py-2 font-mono font-bold text-lg">Numéro :</td>
                <td>
                  <input type="tel" placeholder="Numéro" className="w-full p-2 border rounded" />
                </td>
              </tr>
              <tr>
                <td className="pr-4 py-2 font-mono font-bold text-lg">Mot de passe :</td>
                <td>
                  <input type="password" placeholder="Mot de passe" className="w-full p-2 border rounded" />
                </td>
              </tr>
              <tr>
                <td className="pr-4 py-2 font-mono font-bold text-lg">addresse :</td>
               <td>
                  <input type="text" placeholder="adresse" className="w-full p-2 border rounded" />
                </td>
                  
               
              </tr>
              <tr>
                <td className="pr-4 py-2 font-mono font-bold text-lg font-mono  text-lg">Rôle :</td>
                <td>
                  <input type="text" placeholder="Rôle" className="w-full p-2 border rounded" />
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="pt-4">
                  <button type="submit" className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-500">
                    S'inscrire
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}
