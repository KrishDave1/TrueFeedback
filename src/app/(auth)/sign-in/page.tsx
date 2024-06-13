/** @format */
'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); //This is to prevent multiple requests to the server
  const [isSubmitting, setisSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300); //Debounce(delay the change in useState by 300 milliseconds) the username input to prevent multiple requests to the server
  //This means username will still be updated in real-time but the value of debouncedUsername will only be updated after 300 milliseconds
  const { toast } = useToast();
  const router = useRouter();

  //Zod schema for form validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
      }
    };
  }, [debouncedUsername]);
  return <div>page</div>;
};

export default Page;