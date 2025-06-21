'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Smile } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Cardcomponent() {
    const route = useRouter();
    const startCall = () => { 
        route.push('/call');
     }
  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <div className="w-full max-w-sm cursor-pointer hover:scale-105 transition-transform duration-300">
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl hover:bg-white/20 transition-colors duration-200">
          <CardHeader className="flex items-center space-x-3">
            <Smile className="w-6 h-6 text-white" />
            <CardTitle className="text-white text-lg font-semibold">
              Start a Call
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between px-4 pb-4">
            <p className="text-white/80 text-sm">
              Connect with someone who cares 💛
            </p>
            <button onClick={startCall} className="bg-white/20 text-white p-2 rounded-full shadow-md hover:bg-white/30 transition-colors duration-200 border border-white/30">
              <Phone  className="w-5 h-5" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
