/** @jsx h */
import {
  Button,
  Container,
  Divider,
  SearchTextbox,
  VerticalSpace,
  useForm
} from '@create-figma-plugin/ui'
import { addEventListener, triggerEvent } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'
import { Attributes } from './attributes.js'
import { everyAttribute } from '../utilities/every-attribute'
import { extractKeysByReferenceLayerType } from '../utilities/extract-keys-by-reference-layer-type'
import { extractKeysBySearchTerm } from '../utilities/extract-keys-by-search-term'
import { setAttribute } from '../utilities/set-attribute'
import { toggleAttributes } from '../utilities/toggle-attributes'
import styles from './select-similar-layers.scss'

export function SelectSimilarLayers (initialState) {
  const { state, handleChange, handleSubmit, isInvalid } = useForm(
    { ...initialState, searchTerm: '' },
    {
      transform: function (state) {
        const { attributes, referenceLayerType, searchTerm } = state
        const keysByReferenceLayerType = extractKeysByReferenceLayerType(
          attributes,
          referenceLayerType
        )
        const keysBySearchTerm = extractKeysBySearchTerm(attributes, searchTerm)
        return {
          ...state,
          areAllAttributesChecked:
            everyAttribute(attributes, keysByReferenceLayerType, true) === true,
          keysByReferenceLayerType,
          keysBySearchTerm
        }
      },
      validate: function ({
        attributes,
        keysByReferenceLayerType,
        referenceLayerType
      }) {
        return (
          referenceLayerType !== null &&
          everyAttribute(attributes, keysByReferenceLayerType, false) === false
        )
      },
      onClose: function () {
        triggerEvent('CLOSE')
      },
      onSubmit: function ({ attributes }) {
        triggerEvent('SUBMIT', {
          attributes
        })
      }
    }
  )
  const {
    areAllAttributesChecked,
    attributes,
    keysByReferenceLayerType,
    keysBySearchTerm,
    searchTerm
  } = state
  const handleAttributeClick = useCallback(
    function (object, newValue, targetKey) {
      const { attributes } = state
      handleChange({
        ...state,
        attributes: setAttribute(attributes, targetKey, newValue)
      })
    },
    [handleChange, state]
  )
  const handleCheckAllToggleChange = useCallback(
    function () {
      const newValue = !(areAllAttributesChecked === true)
      handleChange({
        ...state,
        attributes: toggleAttributes(
          attributes,
          keysByReferenceLayerType,
          newValue
        )
      })
    },
    [
      areAllAttributesChecked,
      attributes,
      keysByReferenceLayerType,
      handleChange,
      state
    ]
  )
  useEffect(
    function () {
      return addEventListener('SELECTION_CHANGED', function ({
        referenceLayerType
      }) {
        handleChange({ referenceLayerType })
      })
    },
    [handleChange]
  )
  return (
    <div>
      <div class={styles.wrapper}>
        <div class={styles.search}>
          <SearchTextbox
            name='searchTerm'
            placeholder='Search'
            value={searchTerm}
            onChange={handleChange}
            focused
          />
        </div>
        {searchTerm === '' ? (
          <label class={styles.checkToggle}>
            <input
              type='checkbox'
              checked={areAllAttributesChecked === true}
              onChange={handleCheckAllToggleChange}
            />{' '}
            {areAllAttributesChecked === true ? 'Uncheck all' : 'Check all'}
          </label>
        ) : null}
      </div>
      <Divider />
      <Attributes
        attributes={attributes}
        keysByReferenceLayerType={keysByReferenceLayerType}
        keysBySearchTerm={keysBySearchTerm}
        onClick={handleAttributeClick}
      />
      <Divider />
      <Container space='medium'>
        <VerticalSpace space='small' />
        <Button
          fullWidth
          disabled={isInvalid() === true}
          onClick={handleSubmit}
        >
          Select Similar Layers
        </Button>
        <VerticalSpace space='small' />
      </Container>
    </div>
  )
}