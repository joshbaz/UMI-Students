import apiRequest from "../../../utils/apiRequestUrl"
import { queryClient } from "../../../utils/tanstack"

/* ********** ERROR HANDLING ********** */

const errorHandling = (error: any) => {
    if (error?.response) {
        throw {message: `Error ${error.response.status}: ${error.response.statusText}. ${error.response?.data?.message}`}
    } else if (error.request) {
        throw {message: "No response from server. Please check your network connection."}
    } else {
        throw {message: `Request failed: ${error.message}`}
    }
}

/* ********** STUDENT API SERVICES ********** */

export const loginStudentService = async (user: any) => {
    try {
        const response = await apiRequest.post("/student/login", user);
        const { token, role } = response.data;
        localStorage.setItem('role', role);
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getLoggedInUserService = async () => {
    try {
        const response = await apiRequest.get("/student/logged-in-user");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getStudentProfileService = async () => {
    try {
        const response = await apiRequest.get("/student/profile");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const updateStudentProfileService = async (data: any) => {
    try {
        const response = await apiRequest.put("/student/profile", data);
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const changeStudentPasswordService = async (data: any) => {
    try {
        const response = await apiRequest.put("/student/password", data);
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getStudentDashboardStatsService = async () => {
    try {
        const response = await apiRequest.get("/student/dashboard/stats");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getStudentNotificationsService = async () => {
    try {
        const response = await apiRequest.get("/student/notifications");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const markStudentNotificationAsReadService = async (notificationId: string) => {
    try {
        const response = await apiRequest.put(`/student/notifications/${notificationId}/read`);
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const logoutStudentService = async () => {
    try {
        const response = await apiRequest.post("/student/logout");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
}; 