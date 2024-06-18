'use client'

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import { Key, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false); // This is the loading state for the page
  const [isSwitchLoading, setIsSwitchLoading] = useState(false); // This is the loading state for the switch button in the page

  const { toast } = useToast();

  //Optimistic UI : This is a method that updates the UI before the server responds.Meaning it will show that for eg, like button is clicked and the like count is increased before the server responds.We are optimistic that the server will respond with success.

  //In case of a small database, server response is fast and we don't to update UI first, but in case of a large database, server response is slow and we need to update UI first.So, we use optimistic UI in case of large databases.

  const handleDeleteMessage = (messageId: string) => {
    // This means I will filter the messages array and remove the message with the id that is passed in the argument.Here notice that server is not called to delete the message, we are just updating the UI and later we will call the server to delete the message.
    setMessages(
      messages.filter((message) => {
        message._id !== messageId;
      })
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    // This function is used to get the current status of the user to accept messages
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch messages settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]); //Callback is used to prevent the function from being called again and again.

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      // This function is used to fetch the messages
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log(axiosError)
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch messages settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchMessages, fetchAcceptMessages]);

  // This function is used to update the user status to accept messages
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch messages settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div>Not Authenticated.Please Login</div>;
  }

  const { username } = session?.user as User;

  //TODO: One of the ways to get base url
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied",
      description: "Profile URL copied to clipboard",
    });
  };

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>

      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>{" "}
        <div className='flex items-center'>
          <input
            type='text'
            value={profileUrl}
            disabled
            className='input input-bordered w-full p-2 mr-2'
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch
          {...register("acceptMessages")} //This is used to register the switch button with the React Hook Form.Here name attribute is not required as we destructered the register function and passed the name attribute in the object.
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className='mt-4'
        variant='outline'
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <RefreshCcw className='h-4 w-4' />
        )}
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as Key}
              message={message}
              onMessageDelete={ 
                handleDeleteMessage
              }
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;