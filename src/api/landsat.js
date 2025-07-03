/* src/api/landsat.js  – v2  (ESM + fetch nativo) */
const EARTH_KM_PER_DEG = 111.32          // 1° latitud ≈ 111.32 km :contentReference[oaicite:1]{index=1}
const STAC_URL = process.env.VUE_APP_STAC_URL ||
                  'https://planetarycomputer.microsoft.com/api/stac/v1/search'

export class StacError extends Error {
  constructor (msg, status = 0) { super(msg); this.status = status }
}

/**
 * Consulta STAC y devuelve el primer item Landsat 8 L2 dentro del radio especificado.
 * @param   {Object}  o
 * @param   {number}  o.lat        Latitud  (°)
 * @param   {number}  o.lng        Longitud (°)
 * @param   {number}  [o.radiusKm] Radio de búsqueda [km]      (def. 80)
 * @param   {number}  [o.daysBack] Antigüedad máxima [días]    (def. 30)
 * @param   {number}  [o.cloudMax] % nubes admisible           (def. 100)
 * @param   {string}  [o.collection] STAC collection           (def. landsat-8-c2-l2)
 * @returns {Promise<LandsatResult>}
 */
export async function searchLandsat ({
  lat, lng,
  radiusKm   = 15,
  daysBack   = 30,
  cloudMax   = 15,
  collection = 'landsat-c2-l2',
  signal
}) {
  /* ---- Validaciones básicas ---------------------------------------- */
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new StacError('Lat/Lon fuera de rango permitido')
  }

  /* ---- 1. Fechas ISO (hh:mm:ss no requeridas) ---------------------- */
  const now     = new Date()
  const start   = new Date(now.getTime() - daysBack * 86_400_000)
  const range   = `${start.toISOString().slice(0, 10)}/${now.toISOString().slice(0, 10)}`

  /* ---- 2. Radio → grados, con protecciones ------------------------- */
  const degLat  = radiusKm / EARTH_KM_PER_DEG
  const cosLat  = Math.cos(lat * Math.PI / 180)
  const degLon  = radiusKm / (EARTH_KM_PER_DEG * Math.max(cosLat, 1e-4)) // evita /0 cerca de polos

  const clamp   = (v, min, max) => Math.min(Math.max(v, min), max)
  const bbox    = [
    clamp(lng - degLon, -180,  180),
    clamp(lat - degLat,  -90,   90),
    clamp(lng + degLon, -180,  180),
    clamp(lat + degLat,  -90,   90)
  ]

  /* ---- 3. Construir cuerpo STAC ------------------------------------ */
  const body = {
    collections: [collection],
    bbox,
    datetime   : range,
    limit      : 1,
    query      : { 'eo:cloud_cover': { lt: cloudMax } }
  }

  /* ---- 4. Caché en memoria (muy simple) ---------------------------- */
  const cacheKey = JSON.stringify(body)
  if (!searchLandsat._cache) searchLandsat._cache = new Map()
  if (searchLandsat._cache.has(cacheKey))
    return structuredClone(searchLandsat._cache.get(cacheKey))

  /* ---- 5. Petición con timeout de 15 s ----------------------------- */
  const ac    = new AbortController()
  const timer = setTimeout(() => ac.abort(), 15_000)
  if (signal) signal.addEventListener('abort', () => ac.abort())

  const res = await fetch(STAC_URL, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(body),
    signal : ac.signal
  }).finally(() => clearTimeout(timer))

  if (!res.ok) throw new StacError(await res.text(), res.status)

  const { features } = await res.json()
  if (!features.length) {
    throw new StacError(`Sin escenas en ${radiusKm} km y ${daysBack} días`)
  }

  /* ---- 6. Firmar assets ------------------------------------------- */
 /* ---- 6. Firmar assets ------------------------------------------- */
const item = features[0];

// 1️⃣ Obtener un SAS token válido para el storage account y container
// extraemos los valores desde las propiedades msft:storage_account y msft:container
const storageAccount = item.properties['msft:storage_account'] || 'landsateuwest';
const container      = item.properties['msft:container']       || 'landsat-c2';

const tokenResp = await fetch(
  `https://planetarycomputer.microsoft.com/api/sas/v1/token/${storageAccount}/${container}`
);
if (!tokenResp.ok) {
  throw new StacError(`No se pudo obtener SAS token (${tokenResp.status})`, tokenResp.status);
}
const { token: sas } = await tokenResp.json();  // ej. "sv=…&sr=…&sig=…"

// 2️⃣ Prepara la función de firma usando ese SAS recién obtenido
const sign = href => sas ? `${href}?${sas}` : href;

// 3️⃣ Escoge el asset que quieras firmar para el quicklook
const quickHref =
  item.assets['rendered_preview']?.href ||
  item.assets['preview']?.href           ||
  item.assets['thumbnail']?.href         ||
  null;

// 4️⃣ Devuelve el resultado, incluyendo el token para que MapView.vue lo use
const result = {
  bbox  : item.bbox,
  itemId: item.id,
  sas,    // guardamos el token para MapView.vue
   ...(quickHref && { assets: { quicklook: sign(quickHref) }}),
 // también guardamos las bandas de superficie reflectante
 assets: {
   quicklook: sign(quickHref),
   nir08    : sign(item.assets.nir08.href),
   swir16   : sign(item.assets.swir16.href)
 },
  meta  : {
    id      : item.id,
    datetime: item.properties.datetime,
    cloud   : item.properties['eo:cloud_cover']
  }
};

searchLandsat._cache.set(cacheKey, result);
return structuredClone(result);

}
