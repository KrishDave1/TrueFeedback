/** @format */

import dbConnect from "@/lib/dbConnect"; // DB Connection will be required in every API Route as Next.js runs at server side
import UserModel from "@/model/User";
import bcrpypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
      const { username, email, password } = await request.json();
      UserModel.findOne({
          username,
           
      })
  } catch (error) {
    console.error(error);
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
