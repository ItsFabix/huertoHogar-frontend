
// dominios permitidos: duoc.cl, profesor.duoc.cl, gmail.com
export const EMAIL_ALLOWED = /^[^@\s]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

// RUT/RUN: 12.345.678-5 o 12345678-5 (sin puntos también válido)
export const RUT_VALID = /^(\d{1,2}\.?\d{3}\.?\d{3})-([\dkK])$/;

export function validarRut(rut) {
  if (!RUT_VALID.test(rut)) return false;
  const [, num, dv] = rut.match(RUT_VALID);
  const clean = num.replace(/\./g, "");
  let suma = 0, mul = 2;
  for (let i = clean.length - 1; i >= 0; i--) {
    suma += parseInt(clean[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const resto = 11 - (suma % 11);
  const dvCalc = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return dvCalc.toUpperCase() === String(dv).toUpperCase();
}

export function required(v) {
  return v != null && String(v).trim().length > 0;
}

export function maxLen(v, n) {
  return String(v || "").length <= n;
}

export function betweenLen(v, min, max) {
  const L = String(v || "").length;
  return L >= min && L <= max;
}
