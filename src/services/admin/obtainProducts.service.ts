import api from "../../api/axios";

export const obtainProducts = () => {
    return api.get('/products/list');
};

export const createProduct = (data: any) => {
    return api.post('/products/create', data);
};

export const updateProduct = (id: number, data: any) => {
    return api.put(`/products/update?id=${id}`, data);
};

export const deleteProduct = (id: number) => {
    return api.delete(`/products/delete?id=${id}`);
};
