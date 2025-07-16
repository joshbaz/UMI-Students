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

/* ********** STUDENT STATUS, PROPOSAL, AND BOOK SERVICES ********** */

export const getStudentStatusesService = async (studentId: string) => {
    try {
        const response = await apiRequest.get(`/student/statuses/${studentId}`);
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getStudentProposalsService = async (studentId: string) => {
    try {
        const response = await apiRequest.get(`/student/proposals/${studentId}`);
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getStudentBooksService = async (studentId: string) => {
    try {
        const response = await apiRequest.get(`/student/books/${studentId}`);
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

// ********** RESEARCH REQUESTS **********

export const getStudentResearchRequestsService = async () => {
    try {
        const response = await apiRequest.get("/student/research-requests");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const createStudentResearchRequestService = async (data: any) => {
    try {
        const response = await apiRequest.post("/student/research-requests", data);
        queryClient.invalidateQueries({queryKey: ['studentResearchRequests']});
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getUnreadMessageCountService = async () => {
    try {
        const response = await apiRequest.get("/messages/unread-count");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

// ********** EVALUATION SERVICES **********

export const getAvailableEvaluationsService = async () => {
    try {
        const response = await apiRequest.get("/student/evaluations/available");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const submitStudentEvaluationService = async (evaluationData: any) => {
    try {
        const response = await apiRequest.post("/student/evaluations", evaluationData);
        queryClient.invalidateQueries({queryKey: ['availableEvaluations']});
        queryClient.invalidateQueries({queryKey: ['studentEvaluations']});
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
};

export const getStudentEvaluationsService = async () => {
    try {
        const response = await apiRequest.get("/student/evaluations");
        return response.data;
    } catch (error) {
        errorHandling(error);
    }
}; 