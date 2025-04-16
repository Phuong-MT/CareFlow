import api from "@/utils/axiosConfig";
import { Event, EventRequest } from "@/types/eventTypes";

export const apiGetAllEvents = async(payload: EventRequest) => {
    try {
      const response = await api.get("/events/findAllEvent",
         {
        params:{page: 1, limit: 10}
       }
    );
      return response;
    } catch (error) {
      console.error("Get all events error:", error);
      throw error;
    }
  }
