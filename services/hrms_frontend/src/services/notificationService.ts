import { notificationApi } from '../lib/api';

export interface Notification {
    id: number;
    employee_id: number;
    recipient_email: string;
    recipient_name: string;
    subject: string;
    body: string;
    status: string;
    created_at: string;
    sent_at?: string;
    error_message?: string;
}

export interface NotificationListResponse {
    total: number;
    items: Notification[];
}

export const notificationService = {
    getAll: async (offset = 0, limit = 50, status?: string) => {
        const response = await notificationApi.get<NotificationListResponse>('/notifications', {
            params: { offset, limit, status },
        });
        return response.data;
    },

    getEmployeeNotifications: async (employeeId: number, offset = 0, limit = 50) => {
        const response = await notificationApi.get<NotificationListResponse>(`/notifications/employee/${employeeId}`, {
            params: { offset, limit },
        });
        return response.data;
    },

    retry: async (id: number) => {
        const response = await notificationApi.put<Notification>(`/notifications/${id}/retry`);
        return response.data;
    },
};
