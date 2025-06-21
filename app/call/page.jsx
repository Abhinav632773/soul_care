'use client';

import { Card } from "@/components/ui/card";
import { PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getVapiClient } from "@/lib/vapi";

const VAPI_AGENT_ID = process.env.NEXT_PUBLIC_VAPI_AGENT_ID;

export default function CallPage() {
  const router = useRouter();
  const [callActive, setCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [error, setError] = useState(null);

  const startCall = async () => {
    setError(null);
    try {
      const vapi = getVapiClient();
      if (!vapi) {
        setError('Vapi client not initialized.');
        return;
      }
      setCallStatus('connecting');
      await vapi.start({ assistant: VAPI_AGENT_ID });
      setCallActive(true);
      setCallStatus('in-call');
    } catch (err) {
      setError('Failed to start call: ' + err.message);
      setCallStatus('idle');
    }
  };

  const endCall = async () => {
    try {
      const vapi = getVapiClient();
      if (vapi) {
        await vapi.stop();
      }
      setCallActive(false);
      setCallStatus('idle');
    } catch (err) {
      setError('Failed to end call: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e1e] via-[#252526] to-[#000000] text-white flex flex-col items-center justify-center p-6">
      {/* Title & Subtitle */}
      <div className="w-full max-w-xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Start a Call</h1>
        <p className="text-lg md:text-xl text-white/80 mb-6">Connect instantly with someone who cares. Your conversation is private and secure.</p>
      </div>

      {/* Call Action Card */}
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col items-center w-full max-w-md">
        <PhoneCall className="w-12 h-12 text-green-400 mb-4 animate-pulse" />
        <p className="text-xl font-semibold mb-2 text-white">Ready to talk?</p>
        <p className="text-white/70 mb-6 text-center">Click below to start your call session and connect with a caring listener.</p>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        {callActive ? (
          <>
            <p className="text-green-400 font-semibold mb-4">In Call</p>
            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-200 text-lg"
            >
              End Call
            </button>
          </>
        ) : (
          <button
            onClick={startCall}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-200 text-lg"
            disabled={callStatus === 'connecting'}
          >
            {callStatus === 'connecting' ? 'Connecting...' : 'Start Call'}
          </button>
        )}
      </Card>
    </div>
  );
}
