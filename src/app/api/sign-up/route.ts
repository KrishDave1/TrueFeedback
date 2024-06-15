/** @format */

import dbConnect from "@/lib/dbConnect"; // DB Connection will be required in every API Route as Next.js runs at server side
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmailNodemailer";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      // This is the case where user is already verified and trying to register again
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      // This is the case where user is not verified and trying to register again with same email
      email,
    });
    // console.log("Existing User By Email", existingUserByEmail);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists",
          },
          {
            status: 400,
          }
        );
      } else {
        //Sent verification email again to verify the user.Here password is again hashed and verify code is updated again.
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date();
        existingUserByEmail.verifyCodeExpiry.setHours(
          existingUserByEmail.verifyCodeExpiry.getHours() + 1
        );
        await existingUserByEmail.save();
      }

      //! This is the case where user is not verified and another user is trying to register again with same email of first person.Here we are not giving error as we are getting data only from the email and not from the username, so a bit of concern.
      // if (existingUserByEmail.username !== username) {
      //   return Response.json(
      //     {
      //       success: false,
      //       message: "Email already exists for some other user",
      //     },
      //     {
      //       status: 400,
      //     }
      //   );
      // }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); //Here although expirydate is const but the object it is pointing to is mutable

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send Verification Email
    // const emailResponse = await sendVerificationEmail(
    //   email,
    //   username,
    //   verifyCode
    // );
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User Registered Successfully.Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error Registering User",
      },
      {
        status: 500,
      }
    );
  }
}
