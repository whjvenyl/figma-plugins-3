import { isImage } from './utilities/is-image'
import { isLayerTypeFactory } from './utilities/is-layer-type-factory'
import { mainFactory } from './utilities/main-factory'

export const selectComponents = mainFactory(
  'component',
  isLayerTypeFactory('COMPONENT'),
  function (layer) {
    // components can't be nested inside other components or instances
    return layer.type === 'COMPONENT' || layer.type === 'INSTANCE'
  }
)

export const selectInstanceLayers = mainFactory(
  'instance layer',
  isLayerTypeFactory('INSTANCE')
)

export const selectFrames = mainFactory('frame', isLayerTypeFactory('FRAME'))

export const selectGroups = mainFactory('group', isLayerTypeFactory('GROUP'))

export const selectSlices = mainFactory('slice', isLayerTypeFactory('SLICE'))

const vectorLayerTypes = [
  'BOOLEAN_OPERATION',
  'ELLIPSE',
  'LINE',
  'POLYGON',
  'RECTANGLE',
  'STAR',
  'VECTOR'
]
export const selectVectorLayers = mainFactory(
  'vector layer',
  function isVector (layer) {
    return vectorLayerTypes.includes(layer.type) && isImage(layer) === false
  },
  function (layer) {
    // don't select layers within boolean operation layers
    return layer.type === 'BOOLEAN_OPERATION'
  }
)

export const selectRectangles = mainFactory('rectangle', function (layer) {
  return layer.type === 'RECTANGLE' && isImage(layer) === false
})

export const selectLines = mainFactory('line', function (layer) {
  if (layer.type === 'LINE') {
    return true
  }
  if (layer.type !== 'VECTOR') {
    return false
  }
  if (layer.vectorNetwork.vertices.length !== 2) {
    return false
  }
  const { tangentStart, tangentEnd } = layer.vectorNetwork.segments[0]
  return (
    tangentStart.x === 0 &&
    tangentStart.y === 0 &&
    tangentEnd.x === 0 &&
    tangentEnd.y === 0
  )
})

export const selectEllipses = mainFactory(
  'ellipse',
  isLayerTypeFactory('ELLIPSE')
)

export const selectPolygons = mainFactory(
  'polygon',
  isLayerTypeFactory('POLYGON')
)

export const selectStars = mainFactory('star', isLayerTypeFactory('STAR'))

export const selectBooleanGroups = mainFactory(
  'boolean group',
  isLayerTypeFactory('BOOLEAN_OPERATION')
)

export const selectImages = mainFactory('image', isImage)

export const selectTextLayers = mainFactory(
  'text layer',
  isLayerTypeFactory('TEXT')
)

export const selectMaskLayers = mainFactory('mask layer', function (layer) {
  return layer.isMask === true
})

export const selectHiddenLayers = mainFactory('hidden layer', function (layer) {
  return layer.visible === false
})

export const selectLockedLayers = mainFactory('locked layer', function (layer) {
  return layer.locked === true
})

export const selectLayersWithExports = mainFactory(
  ['layer with export settings', 'layers with export settings'],
  function (layer) {
    return layer.exportSettings.length > 0
  }
)
