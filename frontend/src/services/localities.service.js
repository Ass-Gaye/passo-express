import api from '../api/axios';

export const getLocalities = async () => {
    const response = await api.get('/localities')

    return response.data
    
}
