import { useCallback, useEffect } from "react";
import styles from "../../css_components/CarritoModal.module.css";
import { useLanguage } from "../../context/LanguageContext";

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  return `S/. ${numeric.toFixed(2)}`;
};

export default function CarritoModal({
  isOpen,
  items,
  totalPrice,
  notice,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClear,
  onCheckout,
}) {
  const { t } = useLanguage();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose, isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) handleClose();
  };

  return (
    <div
      id="modal-carrito"
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-carrito-title"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label={t.carrito.cerrar}
        >
          x
        </button>

        <header className={styles.header}>
          <h2 id="modal-carrito-title" className={styles.title}>
            {t.carrito.titulo}
          </h2>
          <p className={styles.subtitle}>{t.carrito.subtitulo}</p>
        </header>

        {notice ? (
          <div
            className={`${styles.notice} ${
              notice.type === "error" ? styles.noticeError : styles.noticeOk
            }`}
            role={notice.type === "error" ? "alert" : "status"}
          >
            {notice.text}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛍️</div>
            <p className={styles.emptyText}>{t.carrito.vacio}</p>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {items.map((item) => (
                <article key={item.id} className={styles.item}>
                  <div className={styles.thumb}>
                    <img src={item.imagen} alt={item.nombre} />
                  </div>
                  <div className={styles.details}>
                    <h3 className={styles.itemTitle}>{item.nombre}</h3>
                    <p className={styles.itemMeta}>{item.marca}</p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        {formatCurrency(item.precioUnitario)}
                      </span>
                      {item.precioOriginal ? (
                        <span className={styles.priceOriginal}>
                          {formatCurrency(item.precioOriginal)}
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.actions}>
                      <div className={styles.qty}>
                        <button
                          type="button"
                          className={styles.qtyButton}
                          onClick={() =>
                            onUpdateQty(item.id, item.cantidad - 1)
                          }
                        >
                          -
                        </button>
                        <span className={styles.qtyValue}>{item.cantidad}</span>
                        <button
                          type="button"
                          className={styles.qtyButton}
                          onClick={() =>
                            onUpdateQty(item.id, item.cantidad + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => onRemoveItem(item.id)}
                      >
                        {t.carrito.quitar}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.totalRow}>
                <span>{t.carrito.total}</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className={styles.summaryActions}>
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={onClear}
                >
                  {t.carrito.vaciar}
                </button>
                <button
                  type="button"
                  className={styles.checkoutButton}
                  onClick={onCheckout}
                >
                  {t.carrito.continuar}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
