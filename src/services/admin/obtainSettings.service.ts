import api from "../../api/axios";

export const obtainSettings = () => {
    return api.get('/settings/list');
};

export const updateSettings = (id: number, data: any) => {
    return api.put(`/settings/update?id=${id}`, data);
};
