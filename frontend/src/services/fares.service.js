import api from '../api/axios';

export const getFares = async () => {
    const response = await api.get('/fares')

    return response.data
}


export const createFare = async (payload) => {
    const response = await api.post('/fares', payload)

    return response.data
    
}
