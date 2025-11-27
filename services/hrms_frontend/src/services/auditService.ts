import { auditApi } from '../lib/api';

export interface AuditLog {
    id: number;
    user_id: number;
    action: string;
    resource_type: string;
    resource_id: string;
    description: string;
    old_value?: string;
    new_value?: string;
    created_at: string;
    ip_address?: string;
}

export interface AuditLogListResponse {
    total: number;
    logs: AuditLog[];
}

export const auditService = {
    getAll: async (offset = 0, limit = 50, action?: string, resource_type?: string) => {
        const response = await auditApi.get<AuditLogListResponse>('/audit/', {
            params: { offset, limit, action, resource_type },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await auditApi.get<AuditLog>(`/audit/${id}`);
        return response.data;
    },
};
