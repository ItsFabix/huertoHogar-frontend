import { NavLink, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCartCount } from "../utils/cart";
import { getSession, clearSession, getUserRole } from "../utils/auth";

export default function Header() {
  const [count, setCount] = useState(getCartCount());
  const [user, setUser] = useState(getSession());
  const [role, setRole] = useState(getUserRole()); // Nuevo estado para el rol
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => {
      setCount(getCartCount());
      setUser(getSession());
      setRole(getUserRole()); // Actualizamos el rol al cambiar sesión
    };

    window.addEventListener("cart:change", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("session:changed", refresh);

    return () => {
      window.removeEventListener("cart:change", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("session:changed", refresh);
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <header className="topbar">
      <nav className="nav container">
        <Link to="/" className="logo" title="HuertoHogar">
          <img src="/img/logo.jpg" alt="HuertoHogar" style={{ height: 56 }} />
        </Link>

        <ul className="menu">
          <li><NavLink to="/" end>Inicio</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/ofertas">Ofertas</NavLink></li>
          <li><NavLink to="/categorias">Categorías</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
        </ul>

        <div className="nav-actions">
          <Link to="/carrito" className="cart-link">
            🛒 <span className="badge">{count}</span>
          </Link>

          <div className="user-menu">
            {user ? <span style={{ fontSize: '14px' }}>Hola, {(user.nombre || "Usuario").split(" ")[0]}</span> : "👤"}

            <div className="user-dropdown">
              {user ? (
                <>
                  <Link to="/ordenes">Mis Órdenes</Link>

                  {/* AHORA MOSTRAMOS EL PANEL SI ES ADMIN O VENDEDOR */}
                  {(role === 'admin' || role === 'vendedor') && (
                    <Link to="/admin" style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                      Panel de Gestión
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid #eee', margin: '4px 0' }}></div>
                  <button className="linklike" onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Iniciar sesión</Link>
                  <Link to="/registro">Registrarse</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}