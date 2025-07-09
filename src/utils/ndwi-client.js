// src/utils/ndwi-client.js
import { fromUrl } from 'geotiff'
import proj4 from 'proj4'

// Definimos las proyecciones para reproyectar coordenadas
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs')
proj4.defs('EPSG:32614', '+proj=utm +zone=14 +datum=WGS84 +units=m +no_defs')

/**
 * Muestra el valor de NDWI en la coordenada dada
 * usando las URLs de las bandas NIR (B5) y SWIR1 (B6).
 * @param {string} nirUrl  URL completa al COG de B5 (incluye SAS)
 * @param {string} swirUrl URL completa al COG de B6 (incluye SAS)
 * @param {number} lat     Latitud (EPSG:4326)
 * @param {number} lng     Longitud (EPSG:4326)
 * @returns {Promise<number>} NDWI = (nir - swir) / (nir + swir)
 */
export async function sampleNdwi(nirUrl, swirUrl, lat, lng) {
  // 1) Abre ambos COGs
  const [tiffNIR, tiffSWIR] = await Promise.all([
    fromUrl(nirUrl),
    fromUrl(swirUrl)
  ])
  const [imgNIR, imgSWIR] = await Promise.all([
    tiffNIR.getImage(),
    tiffSWIR.getImage()
  ])
console.log('GeoKeys:', imgNIR.getGeoKeys())

  // 2) Reproyectar lat/lng a coordenadas de mapa (UTM14N)
  const [xMap, yMap] = proj4('EPSG:4326', 'EPSG:32614', [lng, lat])
  console.log('📐 Reprojected coordinates:', { xMap, yMap })

  // 3) Obtener georreferenciación del COG
  const [originX, originY] = imgNIR.getOrigin()      // [x0, y0]
  const [resX, resY]       = imgNIR.getResolution()  // [pixelWidth, pixelHeight]
  const width  = imgNIR.getWidth()
  const height = imgNIR.getHeight()
  console.log('🏷️ GeoTIFF info → origin:', originX, originY, 'resolution:', resX, resY, 'dims:', width, height)

  // 4) Calcular columna/fila de píxel central
  const col = Math.floor((xMap - originX) / resX)
  const row = Math.floor((originY - yMap) / Math.abs(resY))

  console.log('🗺️ Pixel indices → col:', col, 'row:', row)
console.log('📐 Raster dims → width:', width, 'height:', height)


  // 5) Definir ventana de muestreo de 3×3 píxeles
  const half = 1
  const col0 = Math.max(0, col - half)
  const row0 = Math.max(0, row - half)
  const col1 = Math.min(width, col + half + 1)
  const row1 = Math.min(height, row + half + 1)
  console.log('🔳 Sampling window →', { col0, row0, col1, row1 })

  // 6) Leer ventana de cada banda
  const [nirVals] = await imgNIR.readRasters({ window: [col0, row0, col1, row1], samples: [0] })
  const [swirVals] = await imgSWIR.readRasters({ window: [col0, row0, col1, row1], samples: [0] })
  console.log('📊 nirVals raw:', nirVals)
  console.log('📊 swirVals raw:', swirVals)

  // 7) Convertir de DN a reflectancia y calcular NDWI, filtrando nodata
const SCALE = 0.0000275
const OFFSET = -0.2
const nodataValue = 0  // según metadata de Landsat SR
const ndwiArr = []
for (let i = 0; i < nirVals.length; i++) {
  const rawNir = nirVals[i]
  const rawSwir = swirVals[i]
  // descartar píxeles sin datos (DN = nodataValue)
  if (rawNir === nodataValue || rawSwir === nodataValue) continue
  // convertir a reflectancia de superficie
  const reflNir = rawNir * SCALE + OFFSET
  const reflSwir = rawSwir * SCALE + OFFSET
  // calcular NDWI
  const val = (reflNir - reflSwir) / (reflNir + reflSwir)
  ndwiArr.push(val)
  console.log(`   → NDWI píxel ${i}:`, val)
}

// 8) Retornar null si no hay píxeles válidos
if (ndwiArr.length === 0) {
  console.warn('⚠️ No valid pixels for NDWI después de conversión a reflectancia')
  return null
}

// 9) Promediar NDWI y retornar
const sum = ndwiArr.reduce((acc, v) => acc + v, 0)
const mean = sum / ndwiArr.length
console.log('➗ NDWI promedio:', mean)
return mean
}
