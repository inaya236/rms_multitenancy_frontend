import axios from "axios";
import Base_URL from "../config";

export const sendTokenToBackend = async (token,jwt)=>{
      try {
        const res=await axios.post(
            `${Base_URL}save-fcm-token/`,
        {token : token},
        {
            headers:{
                Authorization:`Bearer ${jwt}`,
                "Content-Type":"application/json",
            },
        }
        );

        console.log("Token saved successfully",res.data)
        return res.data
      } catch (error) {
        console.error("Error sending token:", error.response?.data || error.message);
      }
}