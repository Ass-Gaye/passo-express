import api from '../api/axios'


export const getFares = async () => {

  const response = await api.get('/fares')

  return response.data
}


export const getFare = async (id) => {

  const response = await api.get(`/fares/${id}`)

  return response.data
}


export const createFare = async (payload) => {

  const response = await api.post('/fares', payload)

  return response.data
}


export const updateFare = async (id, payload) => {

  const response = await api.put(
    `/fares/${id}`,
    payload
  )

  return response.data
}


export const deleteFare = async (id) => {

  const response = await api.delete(`/fares/${id}`)

  return response.data
}