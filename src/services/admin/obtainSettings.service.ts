import api from "../../api/axios";

export const obtainSettings = () => {
    return api.get('/settings/list');
};

export const updateSettings = (data: any) => {
    return api.put('/settings/update', data);
};
