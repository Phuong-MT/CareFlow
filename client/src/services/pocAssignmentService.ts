import api from "@/utils/axiosConfig";
import {PocAssignment, ResponsePOC} from "@/types/pocTypes";

export const apiGetPocAssignments = async ():Promise<PocAssignment[]>=>{
    try {
        const response = await api.get<PocAssignment[]>("/poc-assignment/userId")
        return response.data;
    } catch (error) {
        console.error("Get all events by Poc error:", error);
        throw error;
    }
}
export const apiGetPocUser = async()=>{
  try{
    const response = await api.get('poc-assignment/pocUser') 
    return response.data;
  }catch(error){
    console.error("Get all PocUser error:", error);
    throw error;
  }
}