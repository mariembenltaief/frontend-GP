// Admin.js
import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ProduitsSection from './ProduitsSection';
import CategoriesSection from "./CategoriesSection";
import CommandesSection from "./CommandesSection";
import LivraisonsSection from "./LivraisonsSection";
import RapportsSection from "./RapportsSection";
import AlertesSection from "./AlertesSection";
import UsersSection from './UsersSection';
import Parametre from './Parametre';




export default function Admin() {
  const [activeMenu, setActiveMenu] = useState('produits');

  // Définition unique des items du menu
  const menuItems = [
    { key: 'produits', label: 'Produits' },
    { key: 'utilisateurs', label: 'Utilisateurs' },
     { key: "categories", label: "Catégories" },
     { key: "commandes", label: "Commandes" },
     { key: "livraisons", label: "Livraisons" },
     { key: "rapports", label: "Rapports" },
     { key: "alertes", label: "Alertes" },
     { key: "parametres", label: "Paramètres" }

     
  ];

  return (
    <AdminLayout
      menuItems={menuItems}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      {activeMenu === 'produits' && <ProduitsSection />}
      {activeMenu === 'utilisateurs' && <UsersSection />}
      {activeMenu === "categories" && <CategoriesSection />}
      {activeMenu === "commandes" && <CommandesSection />}
       {activeMenu === "livraisons" && <LivraisonsSection />}
       {activeMenu === "rapports" && <RapportsSection />}
       {activeMenu === "alertes" && <AlertesSection />}
       {activeMenu === "parametres" && <Parametre />}


      
    </AdminLayout>
  );
}
