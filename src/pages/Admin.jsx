import { useEffect, useMemo, useState } from "react";
import useAuth from "../auth/hooks/useAuth";
import styles from "../css_components/Admin.module.css";
import { createProduct, updateProduct, deleteProduct, fetchAdminOrders, uploadImage } from "../services/adminApi";
import { fetchProductos } from "../services/productosApi";

const INITIAL_FORM = {
  id: null,
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

  // Data State
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [activeView, setActiveView] = useState("ordenes");
  const [accessForm, setAccessForm] = useState({ email: "", password: "" });
  const [accessError, setAccessError] = useState(null);
  const [isAccessing, setIsAccessing] = useState(false);
  const [message, setMessage] = useState(null);

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Confirm Delete Modal
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = async () => {
    setIsReloading(true);
    setMessage(null);
    try {
      const productosData = await fetchProductos(undefined, undefined, true);
      setProductos(productosData);
      setMessage({ type: "success", text: "Productos recargados correctamente." });
    } catch (error) {
      setMessage({ type: "error", text: "Error al recargar productos: " + error.message });
    } finally {
      setIsReloading(false);
    }
  };

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

  const filteredProducts = useMemo(() => {
    return productos.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? p.categoria === filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [productos, searchTerm, filterCategory]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setForm(INITIAL_FORM);
    setImageFile(null);
    setImagePreview(null);
    setMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (producto) => {
    setIsEditing(true);
    setForm({
      id: producto.id,
      nombre: producto.nombre || "",
      categoria: producto.categoria || "accesorios",
      marca: producto.marca || "",
      imagen: producto.imagen || "",
      descripcion: producto.descripcion || "",
      descripcionDetallada: producto.descripcionDetallada || "",
      precio: producto.precio || "",
      stock: producto.stock || "",
      garantia: producto.garantia || "",
      caracteristicas: producto.caracteristicas?.length ? producto.caracteristicas : [""],
      especificaciones: producto.especificaciones && Object.keys(producto.especificaciones).length > 0
        ? Object.entries(producto.especificaciones).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }],
      masVendido: producto.masVendido || false,
      ofertaActiva: producto.ofertaNavideña?.activa || false,
      ofertaEtiqueta: producto.ofertaNavideña?.etiqueta || "Oferta",
      ofertaPrecioOriginal: producto.ofertaNavideña?.precioOriginal || "",
      ofertaPrecioOferta: producto.ofertaNavideña?.precioOferta || "",
      ofertaDescuento: producto.ofertaNavideña?.descuento || "",
    });
    setImageFile(null);
    setImagePreview(producto.imagen || null);
    setMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setMessage({ type: "error", text: "La imagen supera el límite de 5MB." });
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById("product-image-input");
    if (fileInput) fileInput.value = "";
  };

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

    let finalImageUrl = form.imagen;

    if (imageFile) {
      try {
        setMessage({ type: "info", text: "Subiendo imagen a Supabase..." });
        finalImageUrl = await uploadImage(imageFile);
      } catch (error) {
        setMessage({ type: "error", text: `Error al subir la imagen: ${error.message}` });
        setIsSubmitting(false);
        return;
      }
    } else if (!isEditing && !imagePreview) {
      setMessage({ type: "error", text: "Por favor, selecciona una imagen para el producto." });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      nombre: form.nombre,
      categoria: form.categoria,
      marca: form.marca,
      imagen: finalImageUrl,
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

    try {
      if (isEditing) {
        const result = await updateProduct(form.id, payload);
        setProductos((prev) => prev.map(p => p.id === form.id ? result : p));
        setMessage({ type: "success", text: "Producto actualizado correctamente." });
      } else {
        const result = await createProduct(payload);
        setProductos((prev) => [result, ...prev]);
        setMessage({ type: "success", text: "Producto creado correctamente." });
      }
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete.product) return;
    setIsDeleting(true);
    try {
      await deleteProduct(confirmDelete.product.id);
      setProductos((prev) => prev.filter(p => p.id !== confirmDelete.product.id));
      setConfirmDelete({ isOpen: false, product: null });
    } catch (error) {
      alert("Error al eliminar el producto: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

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

          <br />
          <div className={styles.ordersPanel}>
            <h2 className={styles.panelTitle}>
              <span className={styles.panelTitleIcon}>📦</span>
              Gestión de inventario y ventas
            </h2>

            <div className={styles.toggleRow}>
              <button type="button" className={`${styles.submit} ${activeView !== "ordenes" ? styles.submitSecondary : ""}`} onClick={() => setActiveView("ordenes")}>
                Ordenes
              </button>
              <button type="button" className={`${styles.submit} ${activeView !== "productos" ? styles.submitSecondary : ""}`} onClick={() => { setActiveView("productos"); setCurrentPage(1); }}>
                Productos
              </button>
            </div>

            {isLoading ? (
              <div className={styles.emptyState}>Cargando panel...</div>
            ) : activeView === "productos" ? (
              <div>
                <div className={styles.toolbar}>
                  <div className={styles.toolbarActions}>
                    <input
                      type="text"
                      placeholder="Buscar por nombre o descripción..."
                      className={styles.searchInput}
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                    <button
                      type="button"
                      className={styles.submitSecondary}
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      Filtros avanzados {showAdvancedFilters ? "▲" : "▼"}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      type="button"
                      className={styles.submitSecondary}
                      onClick={handleReload}
                      disabled={isReloading}
                    >
                      {isReloading ? "🔄 Recargando..." : "🔄 Recargar productos"}
                    </button>
                    <button type="button" className={styles.submit} onClick={openCreateModal}>
                      ➕ Crear producto
                    </button>
                  </div>
                </div>

                {showAdvancedFilters && (
                  <div className={styles.advancedFilters}>
                    <div className={styles.field}>
                      <label className={styles.label}>Categoría</label>
                      <select
                        className={styles.select}
                        value={filterCategory}
                        onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="">Todas</option>
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
                )}

                {paginatedProducts.length === 0 ? (
                  <div className={styles.emptyState}>No hay productos que coincidan con la búsqueda.</div>
                ) : (
                  <>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th>Categoria</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((producto) => (
                            <tr key={producto.id}>
                              <td>
                                {producto.imagen && (
                                  <img src={producto.imagen} alt={producto.nombre} className={styles.productThumb} />
                                )}
                              </td>
                              <td>
                                <strong>{producto.nombre}</strong>
                                <div>{producto.marca}</div>
                              </td>
                              <td>{producto.categoria}</td>
                              <td>{formatCurrency(producto.precio)}</td>
                              <td>{producto.stock}</td>
                              <td>
                                <button type="button" className={styles.actionButton} onClick={() => openEditModal(producto)}>Editar</button>
                                <button type="button" className={styles.actionButtonDanger} onClick={() => setConfirmDelete({ isOpen: true, product: producto })}>Eliminar</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className={styles.pagination}>
                        <button
                          className={styles.paginationButton}
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                          Anterior
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.paginationButtonActive : ''}`}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          className={styles.paginationButton}
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{isEditing ? "Editar producto" : "Crear producto"}</h2>
              <button className={styles.closeButton} onClick={closeModal}>&times;</button>
            </div>
            <div className={styles.modalBody}>
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
                  <label className={styles.label}>Imagen del producto</label>
                  <div className={styles.imageUploadArea}>
                    <input
                      id="product-image-input"
                      className={styles.input}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!isEditing && !imagePreview}
                    />
                    <div className={styles.caution}>
                      <span>⚠️</span>
                      <span>Caution: El tamaño máximo de la imagen es de 5MB.</span>
                    </div>
                    {imagePreview && (
                      <div className={styles.imagePreviewContainer}>
                        <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={handleRemoveImage}
                          title="Eliminar imagen"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
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
                    <button type="button" className={`${styles.submit} ${styles.submitSecondary}`} onClick={() => addArrayItem("caracteristicas", "")}>
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
                  {isSubmitting ? "Guardando..." : (isEditing ? "Guardar cambios" : "Crear producto")}
                </button>

                {message ? <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div> : null}
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmDelete.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.confirmModal}`}>
            <div className={styles.modalHeader}>
              <h2>Confirmar eliminación</h2>
              <button className={styles.closeButton} onClick={() => setConfirmDelete({ isOpen: false, product: null })}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <p>¿Estás seguro que deseas eliminar el producto <strong>{confirmDelete.product?.nombre}</strong>?</p>
              <div className={styles.confirmModalActions}>
                <button
                  className={styles.submitSecondary}
                  onClick={() => setConfirmDelete({ isOpen: false, product: null })}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  className={styles.submit}
                  style={{ background: '#dc2626' }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
