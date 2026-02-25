import api from "../../api/axios";

export const obtainOrders = (params?: { search?: string; dateFrom?: string; dateTo?: string }) => {
    return api.get('/orders/list', { params: { sortBy: 'desc', ...params } });
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
