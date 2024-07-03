/** @format */

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from "react";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const PublicPage = () => {
  const { username } = useParams(); // useParams gives us the dynamic route parameters.
  const [disabled, setDisabled] = useState(true);
  const [messageloading, setMessageLoading] = useState(false);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's your favorite movie?",
    "What's your favorite food?",
    "Do you like to travel?",
  ]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setMessageLoading(true);
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content: data.content,
      });
      toast({
        title: "Message Sent",
        description: response.data.message,
      });
    } catch (error) {
      console.error("Error occurred while sending message", error);
      const err = error as AxiosError<ApiResponse>;
      let errorMessage = err?.response?.data.message || "Error sending message";
      toast({
        title: "Message Sending Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setMessageLoading(false);
    }
  };

  const SuggestedMessagesArray = (message: string) => {
    const messages = message.split("||");
    const messagesArray: string[] = [];
    messages.forEach((msg) => {
      messagesArray.push(msg);
    });
    const messagesArrayWithoutNumbers = messagesArray.map((msg) => {
      return msg.replace(/\d+\.|"/g, "").trim();
    });
    setSuggestedMessages(messagesArrayWithoutNumbers);
  };

  const handleSuggestMessages = async () => {
    setSuggestedLoading(true);
    try {
      const response = await axios.post(`/api/suggest-messages`);
      SuggestedMessagesArray(response.data.choices[0].message.content);
      toast({
        title: "Suggested Messages",
        description: "Here are some suggested messages",
      });
    } catch (error) {
      console.error("Error occurred while fetching suggested messages", error);
      const err = error as AxiosError<ApiResponse>;
      let errorMessage =
        err?.response?.data.message || "Error fetching suggested messages";
      toast({
        title: "Fetching Suggested Messages Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSuggestedLoading(false);
    }
  };

  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-2xl md:text-4xl font-bold'>Public Profile Link</h1>
      </section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid w-full max-w-4xl items-center gap-2.5'
        >
          <FormField
            name='content'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Input
                    className='h-16 placeholder:justify-start'
                    placeholder='Write your anonymous message here'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value) {
                        setDisabled(false);
                      } else {
                        setDisabled(true);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {messageloading && (
            <div className='text-center mt-4'>
              <Button>
                <Loader2 className='animate-spin w-6 h-6' />
                Sending Message
              </Button>
            </div>
          )}
          {!messageloading && (
            <div className='text-center mt-4'>
              {disabled ? (
                <Button className='bg-gray-400 cursor-not-allowed hover:bg-gray-400 '>
                  Send Message
                </Button>
              ) : (
                <Button className='hover:bg-slate-700 '>Send Message</Button>
              )}
            </div>
          )}
        </form>
      </Form>
      <div className='mt-16 w-full max-w-4xl grid gap-2.5'>
        <div>
          {suggestedLoading ? (
            <Button>
              <Loader2 className='animate-spin w-6 h-6' />
              Suggesting Messages
            </Button>
          ) : (
            <Button className='flex-start' onClick={handleSuggestMessages}>
              Suggest Messages
            </Button>
          )}
          {/* <Button className='flex-start' onClick={handleSuggestMessages}>
            Suggest Messages
          </Button> */}
        </div>
        <p>Click on any message to select it</p>
        <Card>
          <CardHeader>
            <CardTitle>Suggested Messages</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-3'>
            {suggestedMessages.map((message, index) => (
              <Card key={index} className='w-full'>
                <CardContent
                  className='flex items-center justify-center p-6 bg-white :hover cursor-pointer'
                  onClick={() => {
                    form.setValue("content", message); //Amazing new thing learnt
                    setDisabled(false);
                  }}
                >
                  <div className='flex flex-col justify-center items-start'>
                    <div className='text-md'>{message}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
        <Separator className='my-5' />
      </div>
      <div className='text-lg text-center grid gap-2'>
        <div>Get Your Message Board</div>
        <div>
          {" "}
          <Button
            onClick={() => {
              router.replace("/sign-up")
            }}
          >Create Account</Button>
        </div>
      </div>
    </main>
  );
};

export default PublicPage;
