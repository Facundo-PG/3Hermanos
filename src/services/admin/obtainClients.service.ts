import api from "../../api/axios";

export const obtainClients = () => {
    return api.get('/auth/list');
};

export const createClient = (data: any) => {
    return api.post('/auth/register', data);
};

export const updateClient = (id: number, data: any) => {
    return api.put(`/auth/update?id=${id}`, data);
};

export const deleteClient = (id: number) => {
    return api.delete(`/auth/delete?id=${id}`);
};
