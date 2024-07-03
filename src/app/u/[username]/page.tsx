/** @format */

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
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

const PublicPage = () => {
  const { username } = useParams(); // useParams gives us the dynamic route parameters.
  const [disabled, setDisabled] = useState(true);
  const [messageloading, setMessageLoading] = useState(false);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const { toast } = useToast();

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

  const handleSuggestMessages = async () => {
    try {
      const response = await axios.post(`/api/suggest-messages`);
      toast({
        title: "Suggested Messages",
        description: response.data.message,
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
    }
  }

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
          <Button className='flex-start'
            onClick={
            handleSuggestMessages
          }>Suggest Messages</Button>
        </div>
        <p>Click on any message to select it</p>
        <Card>
          <CardHeader>
            <CardTitle>Suggested Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <Card>
              <CardContent className="flex items-center">
                <p>Message1</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PublicPage;
