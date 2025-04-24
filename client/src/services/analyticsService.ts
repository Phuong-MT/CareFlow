import api from '@/utils/axiosConfig'
//import { DataSchema } from '@/types/analyticsTypes';

export const apiAnalyticsDaily = async (payload:{numDays: string | null}) => {
    try {
        const validPayload = {
            numDays: payload.numDays || '30d'
          };
      const response = await api.post('/analytics/daily-queues', validPayload);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }