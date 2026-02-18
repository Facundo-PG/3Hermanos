import api from "../../api/axios";

export const obtainDashboard = () => {
    return api.get('/orders/dashboard');
};
