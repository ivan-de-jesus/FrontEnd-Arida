function buildNdwiUrl ({ itemId, sas }) {
    const expr = '(nir08 - swir16) / (nir08 + swir16)'
    const palette = 'color:palette=-0.1:ffffff,0.10:ff0000,0.25:ffff00,0.40:00ff00'
    return (
      'https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/{z}/{x}/{y}@1x'
      + `?collection=landsat-c2-l2&item=${itemId}`
      + '&assets=nir08,swir16'
      + `&expression=${encodeURIComponent(expr)}`
      + `&${palette}&rescale=-0.1,0.4`
      + (sas ? `&${sas}` : '')
    )
  }
  