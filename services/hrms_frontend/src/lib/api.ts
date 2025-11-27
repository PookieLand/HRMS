import axios from 'axios';

// Base URLs for different services
// In a real environment, these might be routed through an API Gateway
// For now, we'll assume they are accessible via different ports or paths
// You might need to adjust these based on your actual deployment (e.g., Kubernetes Ingress)

const API_BASE_URLS = {
    employee: 'http://localhost:8001/api/v1',
    attendance: 'http://localhost:8002/api/v1',
    leave: 'http://localhost:8003/api/v1',
    user: 'http://localhost:8004/api/v1',
    audit: 'http://localhost:8005/api/v1',
    notification: 'http://localhost:8006/api/v1',
    compliance: 'http://localhost:8007/api/v1',
};

// Create axios instances for each service
export const employeeApi = axios.create({
    baseURL: API_BASE_URLS.employee,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const attendanceApi = axios.create({
    baseURL: API_BASE_URLS.attendance,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const leaveApi = axios.create({
    baseURL: API_BASE_URLS.leave,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const userApi = axios.create({
    baseURL: API_BASE_URLS.user,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const auditApi = axios.create({
    baseURL: API_BASE_URLS.audit,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const notificationApi = axios.create({
    baseURL: API_BASE_URLS.notification,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const complianceApi = axios.create({
    baseURL: API_BASE_URLS.compliance,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors for auth token (if needed later)
const apis = [employeeApi, attendanceApi, leaveApi, userApi, auditApi, notificationApi, complianceApi];

apis.forEach(api => {
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
});
