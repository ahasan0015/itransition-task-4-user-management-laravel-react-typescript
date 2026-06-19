import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="app-container min-vh-100 bg-light">
      <main className="p-4">
        {/* Main Routes */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;