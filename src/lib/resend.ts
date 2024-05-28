/** @format */

import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);




// Logic for OTP verification
/* 
IF existingUserByEmail Exists THEN
    IF existingUserByEmail.isVerified THEN
        success: false, (Logic is if user is already verified then no need to send OTP)
    ELSE
        Save the updated user (meaning save the user details and make him verified by verifying OTP)
    END IF
ELSE
    Create a new user with provided details
    Save the new user
END IF
*/