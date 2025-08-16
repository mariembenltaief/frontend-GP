// Sidebar.js
export default function Sidebar({ menuItems, activeMenu, setActiveMenu }) {
  return (
    <aside className="w-64 bg-blue-500 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.key}>
            <button
              onClick={() => setActiveMenu(item.key)}
              className={`w-full text-left p-2 my-1 rounded ${
                activeMenu === item.key ? 'bg-blue-700' : 'bg-black'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
