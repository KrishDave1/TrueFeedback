/** @format */
"use client";
import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const Home = () => {
  return (
    <>
      <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-3xl md:text-5xl font-bold'>
            Dive into the World of Anonymous Conversations
          </h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>
            Explore Mystery Message - Where your identity remains a secret
          </p>
        </section>
        <Carousel
          plugins={[AutoPlay({ delay: 3000 })]}
          className='w-full max-w-xl'
        >
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className='p-1'>
                    <Card className='h-48 w-full'>
                      <CardHeader className='text-2xl font-bold'>
                        {message.title}
                      </CardHeader>
                      <CardContent className='flex items-center p-6'>
                        <div className="flex flex-col justify-center items-start">
                          <div className='text-lg'>{message.content}</div>
                          <div className="text-sm font-light">{message.received}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              )) //During a callback,if you write curly brcaeees then you have to write return keyword to return the value.So, write round brackets instead of curly braces which will automatically return the value.
            }
          </CarouselContent>
        </Carousel>
      </main>
      <footer className='text-center p-4 md:p-6'>
        <p>&copy; 2024 Mystery Message.All rights reserved</p>
      </footer>
    </>
  );
};

export default Home;
