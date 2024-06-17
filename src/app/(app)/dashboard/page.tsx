'use client'

import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useState } from "react";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isloading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const {toast} = useToast();


  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;