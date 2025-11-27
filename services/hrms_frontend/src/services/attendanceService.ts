import { attendanceApi } from '../lib/api';

export interface Attendance {
    id: number;
    employee_id: number;
    date: string;
    check_in_time?: string;
    check_out_time?: string;
    status: string;
}

export interface AttendanceCreate {
    employee_id: number;
    date: string;
    status: string;
}

export interface CheckInRequest {
    employee_id: number;
}

export interface CheckOutRequest {
    employee_id: number;
}

export interface MonthlySummary {
    employee_id: number;
    month: string;
    total_days_worked: number;
    total_present: number;
    total_absent: number;
    total_late: number;
    working_hours: number;
    records: Attendance[];
}

export const attendanceService = {
    checkIn: async (data: CheckInRequest) => {
        const response = await attendanceApi.post<Attendance>('/attendance/check-in', data);
        return response.data;
    },

    checkOut: async (data: CheckOutRequest) => {
        const response = await attendanceApi.post<Attendance>('/attendance/check-out', data);
        return response.data;
    },

    getEmployeeAttendance: async (employeeId: number, offset = 0, limit = 100) => {
        const response = await attendanceApi.get<Attendance[]>(`/attendance/employee/${employeeId}`, {
            params: { offset, limit },
        });
        return response.data;
    },

    getMonthlySummary: async (employeeId: number, month: string) => {
        const response = await attendanceApi.get<MonthlySummary>(`/attendance/summary/${employeeId}/${month}`);
        return response.data;
    },
};
