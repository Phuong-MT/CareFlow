import api from "@/utils/axiosConfig";
import {PocAssignmentType} from "@/types/pocTypes";

export const apiGetPocAssignments = async ():Promise<PocAssignmentType[]>=>{
    try {
        const response = await api.get<PocAssignmentType[]>("/poc-assignment/userId")
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