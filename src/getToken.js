import { messaging} from "./firebase";
import {getToken} from "firebase/messaging";

export const generateToken= async ()=>{
    try {
        const permission= await Notification.requestPermission();

        if(permission !== "granted") {
            console.log("Permission denied");
            return null
        }

        const token = await getToken(messaging,{
            vapidKey:"BN1tLr1z8GLV2mCN7ZpquVYcaMSo-BompkK09LhH7w5tSHEfQnczHOx9b3mwcOFOV643Wt79t-yQUln-8Bbfp2c"
        })

        console.log("FCM Token",token);
        return token

    } catch (error) {
        console.error("Error: ",error)
    }
}