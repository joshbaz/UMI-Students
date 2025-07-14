import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../utils/tanstack';
import { 
  loginStudentService, 
  getLoggedInUserService,
  getStudentProfileService, 
  updateStudentProfileService, 
  changeStudentPasswordService, 
  getStudentDashboardStatsService, 
  getStudentNotificationsService, 
  markStudentNotificationAsReadService, 
  logoutStudentService 
} from './api';

/* ********** STUDENT QUERIES ********** */

export const useGetLoggedInUser = () => {
  return useQuery({
    queryKey: ['loggedInUser'],
    queryFn: getLoggedInUserService,
    staleTime: Infinity,
    refetchInterval: false,
  });
};

export const useGetStudentProfile = () => {
  return useQuery({
    queryKey: ['studentProfile'],
    queryFn: getStudentProfileService,
    staleTime: Infinity,
    refetchInterval: false,
  });
};

export const useGetStudentDashboardStats = () => {
  return useQuery({
    queryKey: ['studentDashboardStats'],
    queryFn: getStudentDashboardStatsService,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetStudentNotifications = () => {
  return useQuery({
    queryKey: ['studentNotifications'],
    queryFn: getStudentNotificationsService,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/* ********** STUDENT MUTATIONS ********** */

export const useLoginStudentMutation = () => {
  return useMutation({
    mutationFn: loginStudentService,
    onSuccess: (data) => {
      // Store token and user data
      if (data.token) {
        localStorage.setItem('umi_student_auth_token', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user?.role || 'student');
      }
      console.log('Student login successful:', data);
    },
    onError: (error) => {
      // Handle login error
      console.error('Student login failed:', error);
    },
  });
};

export const useUpdateStudentProfileMutation = () => {
  return useMutation({
    mutationFn: updateStudentProfileService,
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      console.log('Student profile updated successfully:', data);
    },
    onError: (error) => {
      console.error('Student profile update failed:', error);
    },
  });
};

export const useChangeStudentPasswordMutation = () => {
  return useMutation({
    mutationFn: changeStudentPasswordService,
    onSuccess: (data) => {
      console.log('Student password changed successfully:', data);
    },
    onError: (error) => {
      console.error('Student password change failed:', error);
    },
  });
};

export const useMarkStudentNotificationAsReadMutation = () => {
  return useMutation({
    mutationFn: markStudentNotificationAsReadService,
    onSuccess: (data) => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['studentNotifications'] });
      console.log('Student notification marked as read:', data);
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
    },
  });
};

export const useLogoutStudentMutation = () => {
  return useMutation({
    mutationFn: logoutStudentService,
    onSuccess: (data) => {
      // Clear stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('umi_student_auth_token');
      console.log('Student logout successful:', data);
    },
    onError: (error) => {
      console.error('Student logout failed:', error);
    },
  });
}; 