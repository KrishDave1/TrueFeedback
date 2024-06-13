/** @format */

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// A POST request will be like a toggle which will enable/disable the user to accept messages from other users
export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages, // If the database has the user with the given userId then update the isAcceptingMessages field with the value of acceptMessages
      },
      {
        new: true, // Return the updated document
      }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found with the given id",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: `User is now ${
          acceptMessages ? "accepting" : "not accepting"
        } messages`,
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

// A GET request will be used to get the current status of the user to accept messages
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found with the given id",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
