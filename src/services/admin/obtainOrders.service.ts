import api from "../../api/axios";

export const obtainOrders = () => {
    return api.get('/orders/list');
};

export const createOrder = (data: any) => {
    return api.post('/orders/create', data);
};

export const updateOrder = (id: number, data: any) => {
    return api.put(`/orders/update?id=${id}`, data);
};

export const deleteOrder = (id: number) => {
    return api.delete(`/orders/delete?id=${id}`);
};
