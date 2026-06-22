import { useEffect, useMemo, useState } from "react";
import useAuth from "../auth/hooks/useAuth";
import styles from "../css_components/Admin.module.css";
import { createProduct, fetchAdminOrders } from "../services/adminApi";
import { fetchProductos } from "../services/productosApi";

const INITIAL_FORM = {
  nombre: "",
  categoria: "accesorios",
  marca: "",
  imagen: "",
  descripcion: "",
  descripcionDetallada: "",
  precio: "",
  stock: "",
  garantia: "",
  caracteristicas: [""],
  especificaciones: [{ key: "", value: "" }],
  masVendido: false,
  ofertaActiva: false,
  ofertaEtiqueta: "Oferta",
  ofertaPrecioOriginal: "",
  ofertaPrecioOferta: "",
  ofertaDescuento: "",
};

const formatCurrency = (value) => `S/. ${Number(value || 0).toFixed(2)}`;

const getShippingLabel = (envio) => {
  if (!envio?.metodo) return "Sin envio";
  return envio.metodo === "pickup" ? "Recojo" : "Envio";
};

const getStatusTone = (status) => {
  if (status === "pagado" || status === "entregado") return "pillSuccess";
  if (status === "enviado") return "pillInfo";
  return "pillWarning";
};

export default function Admin() {
  const { user, login, logout } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("ordenes");
  const [accessForm, setAccessForm] = useState({ email: "", password: "" });
  const [accessError, setAccessError] = useState(null);
  const [isAccessing, setIsAccessing] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") return;

    let mounted = true;

    Promise.all([fetchProductos(), fetchAdminOrders()])
      .then(([productosData, ordenesData]) => {
        if (!mounted) return;
        setProductos(productosData);
        setOrdenes(ordenesData);
      })
      .catch(() => {
        if (mounted) setMessage({ type: "error", text: "No se pudo cargar el panel." });
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user?.role]);

  const stats = useMemo(() => {
    const totalRevenue = ordenes.reduce((acc, orden) => acc + Number(orden.total || 0), 0);
    return {
      productos: productos.length,
      ordenes: ordenes.length,
      ingresos: totalRevenue,
    };
  }, [ordenes, productos.length]);

  const handleAccessSubmit = async (event) => {
    event.preventDefault();
    setIsAccessing(true);
    setAccessError(null);

    const result = await login(accessForm);

    if (!result.ok) {
      setAccessError(result.error);
      setIsAccessing(false);
      return;
    }

    if (result.user?.role !== "admin") {
      logout();
      setAccessError("Necesitas una cuenta con rol admin para ingresar.");
      setIsAccessing(false);
      return;
    }

    setIsAccessing(false);
    setAccessForm({ email: "", password: "" });
  }

  if (!user || user.role !== "admin") {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <div>
              <h1>Acceso administrador</h1>
              <p>
                Ingresa con un usuario que tenga rol admin para abrir el panel.
              </p>
            </div>
          </section>

          <section className={styles.panel}>
            <h2 className={styles.panelTitle}>
              <span className={styles.panelTitleIcon}>🔐</span>
              Iniciar sesion admin
            </h2>

            {user && user.role !== "admin" ? (
              <div className={`${styles.message} ${styles.error}`}>
                Tu sesion actual no tiene permisos de administrador.
                <button type="button" className={styles.submit} onClick={logout} style={{ marginLeft: "0.75rem" }}>
                  Cerrar sesion
                </button>
              </div>
            ) : null}

            <form className={styles.form} onSubmit={handleAccessSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Correo</label>
                <input
                  className={styles.input}
                  type="email"
                  value={accessForm.email}
                  onChange={(e) => setAccessForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Contrasena</label>
                <input
                  className={styles.input}
                  type="password"
                  value={accessForm.password}
                  onChange={(e) => setAccessForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <button className={styles.submit} type="submit" disabled={isAccessing}>
                {isAccessing ? "Verificando..." : "Entrar al panel"}
              </button>
              {accessError ? (
                <div className={`${styles.message} ${styles.error}`}>{accessError}</div>
              ) : null}
            </form>
          </section>
        </div>
      </main>
    );
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (field, index, value, nestedKey = null) => {
    setForm((prev) => {
      const next = [...prev[field]];
      next[index] = nestedKey ? { ...next[index], [nestedKey]: value } : value;
      return { ...prev, [field]: next };
    });
  };

  const addArrayItem = (field, template) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index, minimum = 1) => {
    setForm((prev) => {
      if (prev[field].length <= minimum) return prev;
      return { ...prev, [field]: prev[field].filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      nombre: form.nombre,
      categoria: form.categoria,
      marca: form.marca,
      imagen: form.imagen,
      descripcion: form.descripcion,
      descripcionDetallada: form.descripcionDetallada || form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      garantia: form.garantia,
      caracteristicas: form.caracteristicas.filter(Boolean),
      especificaciones: form.especificaciones.filter((item) => item.key && item.value),
      masVendido: form.masVendido,
      oferta: form.ofertaActiva
        ? {
            activa: true,
            etiqueta: "Oferta",
            precioOriginal: Number(form.ofertaPrecioOriginal || form.precio),
            precioOferta: Number(form.ofertaPrecioOferta || form.precio),
            descuento: Number(form.ofertaDescuento || 0),
          }
        : { activa: false },
    };

    let result;
    try {
      result = await createProduct(payload);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      setIsSubmitting(false);
      return;
    }

    setProductos((prev) => [result, ...prev]);
    setForm(INITIAL_FORM);
    setMessage({ type: "success", text: "Producto creado correctamente." });
    setIsSubmitting(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <h1>Panel de administrador</h1>
            <p>
              Gestiona productos y revisa las ordenes y envios de clientes con la
              misma estetica de TechNova.
            </p>
          </div>
          <div className={styles.heroMeta}>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Usuario</span>
              <span className={styles.metaValue}>{user.name}</span>
            </div>
            <div className={styles.metaCard}>
              <span className={styles.metaLabel}>Rol</span>
              <span className={styles.metaValue}>Admin</span>
            </div>
          </div>
        </section>

        <section className={styles.layout}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>
              <span className={styles.panelTitleIcon}>➕</span>
              Crear producto
            </h2>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre</label>
                  <input className={styles.input} value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Categoria</label>
                  <select className={styles.select} value={form.categoria} onChange={(e) => handleChange("categoria", e.target.value)}>
                    <option value="audio">Audio</option>
                    <option value="gaming">Gaming</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="camaras">Camaras</option>
                    <option value="laptops">Laptops</option>
                    <option value="celulares">Celulares</option>
                    <option value="componentes">Componentes</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Marca</label>
                <input className={styles.input} value={form.marca} onChange={(e) => handleChange("marca", e.target.value)} required />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Imagen</label>
                <input className={styles.input} value={form.imagen} onChange={(e) => handleChange("imagen", e.target.value)} required />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripcion</label>
                <textarea className={styles.textarea} value={form.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)} required />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripcion detallada</label>
                <textarea className={styles.textarea} value={form.descripcionDetallada} onChange={(e) => handleChange("descripcionDetallada", e.target.value)} />
              </div>

              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Precio</label>
                  <input className={styles.input} type="number" step="0.01" min="0" value={form.precio} onChange={(e) => handleChange("precio", e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Stock</label>
                  <input className={styles.input} type="number" min="0" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} required />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Garantia</label>
                <input className={styles.input} value={form.garantia} onChange={(e) => handleChange("garantia", e.target.value)} placeholder="12 meses" />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Caracteristicas</label>
                <div className={`${styles.sectionBox} ${styles.sectionStack}`}>
                  {form.caracteristicas.map((item, index) => (
                    <div key={`car-${index}`} className={styles.fieldRowActions}>
                      <input
                        className={styles.input}
                        value={item}
                        onChange={(e) => updateArrayItem("caracteristicas", index, e.target.value)}
                        placeholder={`Caracteristica ${index + 1}`}
                      />
                      <button type="button" className={`${styles.submit} ${styles.submitSecondary}`} onClick={() => removeArrayItem("caracteristicas", index)}>
                        Quitar
                      </button>
                    </div>
                  ))}
                  <button type="button" className={`${styles.submit} ${styles.submitSecondary}`} onClick={() => addArrayItem("caracteristicas", "") }>
                    + Agregar caracteristica
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Especificaciones</label>
                <div className={styles.sectionBox}>
                  {form.especificaciones.map((item, index) => (
                    <div key={`spec-${index}`} className={styles.fieldRowActions}>
                      <input
                        className={styles.input}
                        value={item.key}
                        onChange={(e) => updateArrayItem("especificaciones", index, e.target.value, "key")}
                        placeholder="Clave"
                      />
                      <input
                        className={styles.input}
                        value={item.value}
                        onChange={(e) => updateArrayItem("especificaciones", index, e.target.value, "value")}
                        placeholder="Valor"
                      />
                      <button type="button" className={`${styles.submit} ${styles.submitSecondary}`} onClick={() => removeArrayItem("especificaciones", index)}>
                        Quitar
                      </button>
                    </div>
                  ))}
                  <button type="button" className={`${styles.submit} ${styles.submitSecondary}`} onClick={() => addArrayItem("especificaciones", { key: "", value: "" })}>
                    + Agregar especificacion
                  </button>
                </div>
              </div>

              <div className={styles.sectionBox}>
                <h3 className={styles.sectionBoxTitle}>Oferta</h3>
                <div className={styles.toggleRow}>
                  <input type="checkbox" checked={form.ofertaActiva} onChange={(e) => handleChange("ofertaActiva", e.target.checked)} />
                  <span>Activar oferta</span>
                </div>
                {form.ofertaActiva ? (
                  <div className={styles.grid2} style={{ marginTop: "var(--space-3)" }}>
                    <div className={styles.field}>
                      <label className={styles.label}>Etiqueta</label>
                      <input className={styles.input} value="Oferta" disabled />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Descuento</label>
                      <input className={styles.input} type="number" min="0" max="100" value={form.ofertaDescuento} onChange={(e) => handleChange("ofertaDescuento", e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Precio original</label>
                      <input className={styles.input} type="number" step="0.01" min="0" value={form.ofertaPrecioOriginal} onChange={(e) => handleChange("ofertaPrecioOriginal", e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Precio oferta</label>
                      <input className={styles.input} type="number" step="0.01" min="0" value={form.ofertaPrecioOferta} onChange={(e) => handleChange("ofertaPrecioOferta", e.target.value)} />
                    </div>
                  </div>
                ) : null}
              </div>

              <label className={styles.toggleRow}>
                <input type="checkbox" checked={form.masVendido} onChange={(e) => handleChange("masVendido", e.target.checked)} />
                <span>Marcar como mas vendido</span>
              </label>

              <button className={styles.submit} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Crear producto"}
              </button>

              {message ? <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div> : null}
            </form>
          </div>

          <div className={styles.ordersPanel}>
            <h2 className={styles.panelTitle}>
              <span className={styles.panelTitleIcon}>📦</span>
              Ordenes y envios
            </h2>

            <div className={styles.toggleRow}>
              <button type="button" className={styles.submit} onClick={() => setActiveView("ordenes")}>
                Ordenes
              </button>
              <button type="button" className={styles.submit} onClick={() => setActiveView("productos")}>
                Productos
              </button>
            </div>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Productos</span>
                <span className={styles.statValue}>{stats.productos}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Ordenes</span>
                <span className={styles.statValue}>{stats.ordenes}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Ingresos</span>
                <span className={styles.statValue}>{formatCurrency(stats.ingresos)}</span>
              </div>
            </div>

            {isLoading ? (
              <div className={styles.emptyState}>Cargando panel...</div>
            ) : activeView === "productos" ? (
              productos.length === 0 ? (
                <div className={styles.emptyState}>No hay productos creados.</div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Categoria</th>
                        <th>Precio</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto) => (
                        <tr key={producto.id}>
                          <td><strong>{producto.nombre}</strong><div>{producto.marca}</div></td>
                          <td>{producto.categoria}</td>
                          <td>{formatCurrency(producto.precio)}</td>
                          <td>{producto.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : ordenes.length === 0 ? (
              <div className={styles.emptyState}>No hay ordenes registradas.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Orden</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Envio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.map((orden) => (
                      <tr key={orden.id}>
                        <td>
                          <strong>{orden.id.slice(0, 8).toUpperCase()}</strong>
                          <div>{new Date(orden.createdAt).toLocaleString()}</div>
                        </td>
                        <td>{orden.userId}</td>
                        <td>{formatCurrency(orden.total)}</td>
                        <td>{getShippingLabel(orden.envio)}</td>
                        <td>
                          <span className={`${styles.pill} ${styles[getStatusTone(orden.status)]}`}>
                            {orden.status || "pendiente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
