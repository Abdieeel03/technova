import { jsPDF } from "jspdf";

const PRIMARY = [21, 101, 138];
const TEXT_SOFT = [110, 120, 130];
const TEXT = [30, 34, 40];
const LINE = [225, 229, 233];

const formatCurrency = (value) => `S/. ${Number(value || 0).toFixed(2)}`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("es-PE");
};

const getShortOrderId = (id) => {
  if (!id) return "-------";
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
};

/**
 * Genera y descarga un PDF con el historial completo de compras de un usuario.
 * @param {object} params
 * @param {Array} params.orders - Lista de órdenes del usuario.
 * @param {object} params.user - Usuario autenticado ({ name, email }).
 * @param {object} params.t - Diccionario de traducciones activo (t.misCompras / t.common).
 */
export function generarPdfCompras({ orders, user, t }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  let y = 50;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - 50) {
      doc.addPage();
      y = 50;
    }
  };

  // Encabezado
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TechNova", marginX, 32);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(t?.misCompras?.titulo || "Mis compras", marginX, 50);

  y = 95;
  doc.setTextColor(...TEXT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(user?.name || "-", marginX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_SOFT);
  doc.text(user?.email || "-", marginX, y + 14);
  doc.text(`Generado el ${new Date().toLocaleString("es-PE")}`, marginX, y + 28);

  const totalGastado = (orders || []).reduce(
    (acc, order) => acc + Number(order.total || 0),
    0,
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(12);
  doc.text(
    `${t?.misCompras?.totalGastado || "Total gastado"}: ${formatCurrency(totalGastado)}`,
    pageWidth - marginX,
    y,
    { align: "right" },
  );
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TEXT_SOFT);
  doc.text(
    `${(orders || []).length} pedido(s)`,
    pageWidth - marginX,
    y + 14,
    { align: "right" },
  );

  y += 45;
  doc.setDrawColor(...LINE);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 25;

  if (!orders || orders.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_SOFT);
    doc.text(t?.misCompras?.sinCompras || "Aún no tienes compras", marginX, y);
  }

  (orders || []).forEach((order) => {
    const items = order.items || [];
    const shippingCost = Number(order.envio?.costoEnvio || 0);
    const computedSubtotal = items.reduce(
      (acc, item) =>
        acc + Number(item.precioUnitario || 0) * Number(item.cantidad || 0),
      0,
    );
    const subtotal = Number.isFinite(Number(order.subtotal))
      ? Number(order.subtotal)
      : computedSubtotal;
    const total = Number.isFinite(Number(order.total))
      ? Number(order.total)
      : subtotal + shippingCost;

    ensureSpace(70);

    // Cabecera de la orden
    doc.setFillColor(245, 248, 250);
    doc.rect(marginX, y - 14, pageWidth - marginX * 2, 26, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...TEXT);
    doc.text(
      `${t?.misCompras?.pedido || "Pedido #"}${getShortOrderId(order.id)}`,
      marginX + 8,
      y + 3,
    );
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_SOFT);
    doc.text(formatDate(order.createdAt), pageWidth - marginX - 8, y + 3, {
      align: "right",
    });
    y += 22;

    doc.setFontSize(9.5);
    doc.setTextColor(...TEXT_SOFT);
    const estado = order.status
      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
      : "-";
    doc.text(`Estado: ${estado}`, marginX + 8, y);
    y += 16;

    // Tabla de items
    items.forEach((item) => {
      ensureSpace(18);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...TEXT);
      const nombre = item.nombre || "-";
      const maxWidth = pageWidth - marginX * 2 - 160;
      const lines = doc.splitTextToSize(nombre, maxWidth);
      doc.text(lines, marginX + 8, y);
      const cantidad = `x${item.cantidad || 1}`;
      doc.text(cantidad, pageWidth - marginX - 130, y, { align: "right" });
      const lineTotal = formatCurrency(
        Number(item.precioUnitario || 0) * Number(item.cantidad || 0),
      );
      doc.text(lineTotal, pageWidth - marginX - 8, y, { align: "right" });
      y += lines.length * 12 + 4;
    });

    y += 6;
    doc.setDrawColor(...LINE);
    doc.line(marginX + 8, y, pageWidth - marginX - 8, y);
    y += 16;

    // Totales
    doc.setFontSize(9.5);
    doc.setTextColor(...TEXT_SOFT);
    doc.text(`${t?.common?.subtotal || "Subtotal"}`, pageWidth - marginX - 160, y);
    doc.text(formatCurrency(subtotal), pageWidth - marginX - 8, y, {
      align: "right",
    });
    y += 14;

    if (order.envio?.metodo) {
      doc.text(`${t?.common?.envio || "Envío"}`, pageWidth - marginX - 160, y);
      doc.text(
        shippingCost > 0 ? formatCurrency(shippingCost) : (t?.common?.gratis || "Gratis"),
        pageWidth - marginX - 8,
        y,
        { align: "right" },
      );
      y += 14;
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text(`${t?.common?.total || "Total"}`, pageWidth - marginX - 160, y);
    doc.text(formatCurrency(total), pageWidth - marginX - 8, y, {
      align: "right",
    });

    y += 28;
  });

  // Pie de página con numeración
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_SOFT);
    doc.text(
      `TechNova · Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: "center" },
    );
  }

  const fecha = new Date().toISOString().slice(0, 10);
  doc.save(`technova-compras-${fecha}.pdf`);
}
