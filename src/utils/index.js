import { without, union } from 'lodash/array'
import { omit } from 'lodash/object'

export const normToArr = norm => norm.ids.map(id => norm.data[id])

export const toArr = (ids, data) => ids.map(id => data[id])

export const mapPickIds = (ids, map) =>
  ids.reduce(
    (acc, id) => ({
      ...acc,
      [id]: map[id]
    }),
    {}
  )

export const pickFromNormalized = (ids, norm) => ({
  ids,
  data: mapPickIds(ids, norm.data)
})

export const arrToNorm = arr =>
  arr.reduce(
    ({ ids, data }, item) => ({
      ids: ids.concat(item.id),
      data: {
        ...data,
        [item.id]: item
      }
    }),
    { ids: [], data: {} }
  )

export const addToNormalized = (val, existingObj) => {
  const newIds = []
  const newData = {}

  const arr = Array.isArray(val) ? val : [val]

  arr.forEach(item => {
    newIds.push(item.id)
    newData[item.id] = {
      ...item
    }
  })

  return {
    ids: union(existingObj.ids, newIds),
    data: { ...existingObj.data, ...newData }
  }
}

export const removeFromNormalized = (itemId, normalizedData) => {
  const ids = without(normalizedData.ids, itemId)
  const data = omit(normalizedData.data, itemId)

  return {
    ids,
    data
  }
}

export const arrToggleEl = (arr, item) =>
  arr.includes(item) ? without(arr, item) : arr.concat(item)
