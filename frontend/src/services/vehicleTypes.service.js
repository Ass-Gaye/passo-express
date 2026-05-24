import api from '../api/axios';


export const getVehicleTypes = async () => {

    const response = await api.get('/vehicle-types');

    return response.data;

}