import styles from "../../css_components/ReclamacionDetailsModal.module.css";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const getTypeLabel = (tipo) => {
  if (!tipo) return "Sin tipo";
  if (tipo === "Reclamo") return "Reclamo";
  if (tipo === "Queja") return "Queja";
  return tipo;
};

const getTypeTone = (tipo) => {
  if (tipo === "Reclamo") return styles.typeReclamo;
  if (tipo === "Queja") return styles.typeQueja;
  return styles.typeQueja;
};

export default function ReclamacionDetailsModal({ reclamacion, onClose }) {
  if (!reclamacion) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {getTypeLabel(reclamacion.tipo)} de {reclamacion.nombre}
            </h2>
            <p className={styles.subtitle}>
              Registrada el {formatDate(reclamacion.fecha)}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Datos del cliente</h3>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Nombre</span>
              <span className={styles.kvValue}>{reclamacion.nombre || "-"}</span>
            </div>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Correo</span>
              <span className={styles.kvValue}>{reclamacion.correo || "-"}</span>
            </div>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Teléfono</span>
              <span className={styles.kvValue}>{reclamacion.telefono || "-"}</span>
            </div>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Tipo</span>
              <span className={styles.kvValue}>
                <span className={`${styles.typePill} ${getTypeTone(reclamacion.tipo)}`}>
                  {getTypeLabel(reclamacion.tipo)}
                </span>
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Detalle de la reclamación</h3>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Motivo</span>
              <span className={styles.kvValue}>{reclamacion.motivo || "-"}</span>
            </div>
            <div className={styles.kv}>
              <span className={styles.kvLabel}>Pedido</span>
              <span className={styles.kvValue}>{reclamacion.pedido || "-"}</span>
            </div>
            <div>
              <p className={styles.kvLabel} style={{ marginBottom: "6px" }}>
                Descripción
              </p>
              <p className={styles.description}>
                {reclamacion.descripcion || "-"}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
