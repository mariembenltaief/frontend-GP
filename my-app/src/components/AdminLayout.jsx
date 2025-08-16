// AdminLayout.js
import Sidebar from './Sidebar';

export default function AdminLayout({ menuItems, activeMenu, setActiveMenu, children }) {
  return (
    <div className="flex h-screen">
      <Sidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
