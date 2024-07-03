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

const PublicPage = () => {
  const { username } = useParams(); // useParams gives us the dynamic route parameters.
  const [disabled, setDisabled] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
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
          <div className='text-center mt-4'>
            {disabled ? (
              <Button className='bg-gray-400 cursor-not-allowed hover:bg-gray-400 '>
                Send Message
              </Button>
            ) : (
              <Button className='hover:bg-slate-700'>Send Message</Button>
            )}
          </div>
        </form>
      </Form>
    </main>
  );
};

export default PublicPage;
