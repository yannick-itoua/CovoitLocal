import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getAllTrips = async () => {
    const response = await api.get('/trips');
    return response.data;
    };

export const getTrip = async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
    };

export const createTrip = async (trip) => {
    const response = await api.post('/trips', trip);
    return response.data;
    };

export const updateTrip = async (id, trip) => {
    const response = await api.put(`/trips/${id}`, trip);
    return response.data;
    };

 export const bookTrip = async (tripId, passengerId) => {
        const response = await api.post('/trips/book', { tripId, passengerId });
        return response.data;
    };

    export const cancelTrip = async (tripId, passengerId) => {
        const response = await api.post('/trips/cancel', { tripId, passengerId });
        return response.data;
    };
    
export const deleteTrip = async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
    };

export const getAllDrivers = async () => {
    const response = await api.get('/drivers');
    return response.data;
    };

export const getDriver = async (id) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
    };

export const createDriver = async (driver) => {
    const response = await api.post('/drivers', driver);
    return response.data;
    };
export const loginDriver = async (driver) => {
    const response = await api.post('/drivers/login', driver);
    return response.data;
    };

export const updateDriver = async (id, driver) => {
    const response = await api.put(`/drivers/${id}`, driver);
    return response.data;
    };

export const deleteDriver = async (id) => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
    };

export const getAllPassengers = async () => {
    const response = await api.get('/passengers');
    return response.data;
    };

export const getPassenger = async (id) => {
    const response = await api.get(`/passengers/${id}`);
    return response.data;
    };

export const createPassenger = async (passenger) => {
    const response = await api.post('/passengers', passenger);
    return response.data;
    };
export const loginPassenger = async (passenger) => {
    const response = await api.post('/passengers/login', passenger);
    return response.data;
    };

export const updatePassenger = async (id, passenger) => {
    const response = await api.put(`/passengers/${id}`, passenger);
    return response.data;
    };

export const deletePassenger = async (id) => {
    const response = await api.delete(`/passengers/${id}`);
    return response.data;
    };


export default api;