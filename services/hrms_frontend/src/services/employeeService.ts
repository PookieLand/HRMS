import { employeeApi } from '../lib/api';

export interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    job_title: string;
    start_date: string;
    contract_type: string;
    status: string;
    age: number;
}

export interface EmployeeCreate {
    name: string;
    email: string;
    department: string;
    job_title: string;
    start_date: string;
    contract_type: string;
    age: number;
}

export interface EmployeeUpdate {
    name?: string;
    email?: string;
    department?: string;
    job_title?: string;
    contract_type?: string;
    status?: string;
    age?: number;
}

export const employeeService = {
    getAll: async (offset = 0, limit = 100) => {
        const response = await employeeApi.get<Employee[]>('/employees/', {
            params: { offset, limit },
        });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await employeeApi.get<Employee>(`/employees/${id}`);
        return response.data;
    },

    create: async (data: EmployeeCreate) => {
        const response = await employeeApi.post<Employee>('/employees/', data);
        return response.data;
    },

    update: async (id: number, data: EmployeeUpdate) => {
        const response = await employeeApi.patch<Employee>(`/employees/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await employeeApi.delete(`/employees/${id}`);
        return response.data;
    },
};
