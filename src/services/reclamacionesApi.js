export const crearReclamacion = async (reclamacion) => {
  const response = await fetch("/api/reclamaciones", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reclamacion),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al registrar la reclamación");
  }

  return data;
};