import { userApi } from '../lib/api';

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    status: string;
    employee_id?: number;
    last_login?: string;
}

export interface UserListResponse {
    total: number;
    users: User[];
}

export interface UserRoleUpdate {
    role: string;
}

export const userService = {
    getAll: async (offset = 0, limit = 50, role?: string, status?: string) => {
        const response = await userApi.get<UserListResponse>('/users/', {
            params: { offset, limit, role, status },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await userApi.get<User>(`/users/${id}`);
        return response.data;
    },

    updateRole: async (id: number, role: string) => {
        const response = await userApi.post<User>(`/users/${id}/role`, { role });
        return response.data;
    },

    suspend: async (id: number, reason: string) => {
        const response = await userApi.put<User>(`/users/${id}/suspend`, { reason });
        return response.data;
    },

    activate: async (id: number) => {
        const response = await userApi.put<User>(`/users/${id}/activate`);
        return response.data;
    },

    delete: async (id: number, reason?: string) => {
        const response = await userApi.delete(`/users/${id}`, {
            data: { reason },
        });
        return response.data;
    },
};
