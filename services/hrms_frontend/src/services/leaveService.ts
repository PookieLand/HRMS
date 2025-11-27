import { leaveApi } from '../lib/api';

export interface Leave {
    id: number;
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    approved_by?: number;
    rejection_reason?: string;
}

export interface LeaveCreate {
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
}

export interface LeaveStatusUpdate {
    status: string;
    approved_by?: number;
    rejection_reason?: string;
}

export const leaveService = {
    create: async (data: LeaveCreate) => {
        const response = await leaveApi.post<Leave>('/leaves/', data);
        return response.data;
    },

    getEmployeeLeaves: async (employeeId: number, offset = 0, limit = 100) => {
        const response = await leaveApi.get<Leave[]>(`/leaves/employee/${employeeId}`, {
            params: { offset, limit },
        });
        return response.data;
    },

    getAllLeaves: async (offset = 0, limit = 100, status?: string) => {
        const response = await leaveApi.get<Leave[]>('/leaves/', {
            params: { offset, limit, status },
        });
        return response.data;
    },

    updateStatus: async (id: number, data: LeaveStatusUpdate) => {
        const response = await leaveApi.put<Leave>(`/leaves/${id}`, data);
        return response.data;
    },

    cancel: async (id: number) => {
        const response = await leaveApi.delete(`/leaves/${id}`);
        return response.data;
    },
};
