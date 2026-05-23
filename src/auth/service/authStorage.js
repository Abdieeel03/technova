import bcrypt from "bcryptjs";

const USERS_KEY = "technovaUsers";
const SESSION_KEY = "technovaSession";
const SALT_ROUNDS = 10;

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

const getUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  const parsed = safeParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const buildUser = ({ name, email, password }) => {
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
};

const buildSession = (userId) => ({
  userId,
  loggedAt: new Date().toISOString(),
});

export const registerUser = ({ name, email, password }) => {
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

  const users = getUsers();
  const exists = users.some((user) => user.email === trimmedEmail);

  if (exists) {
    return { ok: false, error: "Ya existe una cuenta con ese correo." };
  }

  const newUser = buildUser({
    name: trimmedName,
    email: trimmedEmail,
    password: trimmedPassword,
  });

  saveUsers([...users, newUser]);
  localStorage.setItem(SESSION_KEY, JSON.stringify(buildSession(newUser.id)));

  return {
    ok: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  };
};

export const loginUser = ({ email, password }) => {
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { ok: false, error: "Completa correo y contrasena para continuar." };
  }

  const users = getUsers();
  const user = users.find((entry) => entry.email === trimmedEmail);

  if (!user || !bcrypt.compareSync(trimmedPassword, user.passwordHash)) {
    return { ok: false, error: "Correo o contrasena invalidos." };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(buildSession(user.id)));

  return {
    ok: true,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  const session = safeParse(raw, null);

  if (!session?.userId) {
    return null;
  }

  const users = getUsers();
  const user = users.find((entry) => entry.id === session.userId);

  if (!user) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email };
};

export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  const session = safeParse(raw, null);
  return session?.userId ? session : null;
};
