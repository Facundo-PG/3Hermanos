import api from "../../api/axios";

interface EmailData {
    orderId: number;
    estado: string;
    email: string;
    nombre: string;
}

export const sendEmailNotification = (data: EmailData) => {
    return api.post('/notifications/email', {
        order_id: data.orderId,
        estado: data.estado,
        email: data.email,
        nombre: data.nombre
    });
};
