const USUARIOS_KEY = "myAppUsers";
const SESION_KEY = "activeUser";
const EXPIRACION_SESION = 60 * 60;
const ROL_POR_DEFECTO = "user";

// Prototipo: la clave viaja dentro del bundle, sirve para simular la sesión, no para producción.
const SECRET_KEY = "dade_#!$!$DADWADAWDDAW_413141419KE3MDmdoa/#/(/)*";

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

async function claveHmac() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function crearHash(psw) {
  const digest = await crypto.subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(psw));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function crearJWT(subject) {
  const header = { alg: "HS256", typ: "JWT" };
  const ahora = Math.floor(Date.now() / 1000);
  const payload = { sub: subject, iat: ahora, exp: ahora + EXPIRACION_SESION };

  const sinFirma = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const firma = await crypto.subtle.sign("HMAC", await claveHmac(), new TextEncoder().encode(sinFirma));

  return `${sinFirma}.${base64UrlEncode(String.fromCharCode(...new Uint8Array(firma)))}`;
}

export async function verifyJWT(token) {
  const partes = token.split(".");
  if (partes.length !== 3) throw new Error("El token no tiene el formato correcto");

  const [header, payload, firma] = partes;
  const contenido = JSON.parse(base64UrlDecode(payload));

  if (contenido.exp && Math.floor(Date.now() / 1000) > contenido.exp) throw new Error("El token ha expirado");

  const bytesFirma = Uint8Array.from(base64UrlDecode(firma), (c) => c.charCodeAt(0));
  const valida = await crypto.subtle.verify(
    "HMAC",
    await claveHmac(),
    bytesFirma,
    new TextEncoder().encode(`${header}.${payload}`),
  );
  if (!valida) throw new Error("Firma inválida");

  return contenido;
}

function normalizarEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function leerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(USUARIOS_KEY)) || {};
  } catch {
    return {};
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
}

function datosPublicos(registro) {
  return {
    email: registro.email,
    nombre: registro.firstName,
    apellido: registro.lastName,
    role: registro.role,
  };
}

export function emailRegistrado(email) {
  return Object.hasOwn(leerUsuarios(), normalizarEmail(email));
}

export async function registrarUsuario({ nombre, apellido, email, password, role = ROL_POR_DEFECTO }) {
  const clave = normalizarEmail(email);
  const usuarios = leerUsuarios();

  if (Object.hasOwn(usuarios, clave)) throw new Error("Ese correo ya está registrado");

  usuarios[clave] = {
    email: clave,
    firstName: nombre.trim(),
    lastName: apellido.trim(),
    password: await crearHash(password),
    role,
  };

  guardarUsuarios(usuarios);
  return datosPublicos(usuarios[clave]);
}

export async function iniciarSesion({ email, password }) {
  const registro = leerUsuarios()[normalizarEmail(email)];
  if (!registro) throw new Error("No existe una cuenta con ese correo");
  if (registro.password !== (await crearHash(password))) throw new Error("Contraseña incorrecta");

  sessionStorage.setItem(SESION_KEY, await crearJWT({ user: registro.email, role: registro.role }));
  return datosPublicos(registro);
}

export function cerrarSesion() {
  sessionStorage.removeItem(SESION_KEY);
}

export async function obtenerSesion() {
  const token = sessionStorage.getItem(SESION_KEY);
  if (!token) return null;

  try {
    const { sub } = await verifyJWT(token);
    const registro = leerUsuarios()[normalizarEmail(sub.user)];
    if (!registro) throw new Error("La cuenta de esta sesión ya no existe");
    return datosPublicos(registro);
  } catch {
    sessionStorage.removeItem(SESION_KEY);
    return null;
  }
}