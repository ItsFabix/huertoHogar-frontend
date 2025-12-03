import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Blog from "./pages/Blog";
import BlogDetalle from "./pages/BlogDetalle";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Carrito from "./pages/Carrito";
import Categorias from "./pages/Categorias";
import Ofertas from "./pages/Ofertas";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Admin from "./pages/Admin";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import CompraExitosa from "./pages/CompraExitosa"; // <--- NUEVO
import CompraFallida from "./pages/CompraFallida"; // <--- NUEVO

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container main-content">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:codigo" element={<DetalleProducto />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categoria" element={<Categorias />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetalle />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />

          {/* Rutas Protegidas: Requieren Login */}
          <Route 
            path="/ordenes" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orden/:id" 
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/compra-exitosa" 
            element={
              <ProtectedRoute>
                <CompraExitosa />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/compra-fallida" 
            element={
              <ProtectedRoute>
                <CompraFallida />
              </ProtectedRoute>
            } 
          />

          {/* Rutas Protegidas: Solo Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}