const SESSION_KEY = "technovaSession";

const safeParse = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const buildSession = (user) => ({
  userId: user.id,
  user,
  loggedAt: new Date().toISOString(),
});

const normalizeUser = (user) => ({
  ...user,
  role: user?.role || user?.rol || "cliente",
});

const requestJson = async (url, options) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    return { ok: false, error: "Completa todos los campos." };
  }

  if (trimmedPassword.length < 6) {
    return {
      ok: false,
      error: "La contrasena debe tener al menos 6 caracteres.",
    };
  }

  try {
    const data = await requestJson("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      }),
    });

    const user = normalizeUser(data.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(buildSession(user)));

    return { ok: true, user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const loginUser = async ({ email, password }) => {
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { ok: false, error: "Completa correo y contrasena para continuar." };
  }

  try {
    const data = await requestJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
    });

    const user = normalizeUser(data.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(buildSession(user)));

    return { ok: true, user };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  const session = safeParse(raw, null);

  if (!session?.user?.id) {
    return null;
  }

  return normalizeUser(session.user);
};

export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  const session = safeParse(raw, null);
  return session?.userId ? session : null;
};
