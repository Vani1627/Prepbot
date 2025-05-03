"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

interface AgentProps {
    userName: string;
    userId: string;
    interviewId?: string;
    feedbackId?: string;
    type: string;
    questions?: string[];
}

const Agent = ({ userName, userId, interviewId, feedbackId, type, questions }: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>("");

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        const onMessage = (message: any) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setMessages((prev) => [...prev, { role: message.role, content: message.transcript }]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: Error) => console.error("Vapi Error:", JSON.stringify(error, null, 2));

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        try {
            const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
            const interviewerId = process.env.NEXT_PUBLIC_VAPI_INTERVIEWER_ID;
            if (!workflowId) throw new Error("Missing workflow ID");

            console.log("Starting Vapi call...");
            console.log("API URL:", `https://api.vapi.ai/v1/squads/${process.env.NEXT_PUBLIC_VAPI_SQUAD_ID}/call/web`);
            console.log("Workflow ID:", workflowId);
            console.log("Username:", userName);
            console.log("User ID:", userId);

            if (type === "generate") {
                await vapi.start(workflowId, {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    },
                });
            } else {
                if (!questions || questions.length === 0) {
                    console.error("Missing interview questions.");
                    setCallStatus(CallStatus.INACTIVE);
                    return;
                }

                const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");

                await vapi.start(interviewerId ?? "", {
                    variableValues: {
                        questions: formattedQuestions,
                    },
                });
            }

            console.log("Vapi call started successfully!");
        } catch (error) {
            console.error("Error starting Vapi call:", JSON.stringify(error, null, 2));
            setCallStatus(CallStatus.INACTIVE);
        }
    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    return (
        <>
            <div className="call-view">
                {/* AI Interviewer Card */}
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" alt="profile-image" width={65} height={54} className="object-cover" />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                {/* User Profile Card */}
                <div className="card-border">
                    <div className="card-content">
                        <Image src="/user-avatar.png" alt="profile-image" width={120} height={120} className="rounded-full object-cover" />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p className={cn("transition-opacity duration-500 opacity-0", "animate-fadeIn opacity-100")}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button className="relative btn-call" onClick={handleCall}>
                        <span className={cn("absolute animate-ping rounded-full opacity-75", callStatus !== CallStatus.CONNECTING ? "hidden" : "")} />
                        <span>{callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Call" : ". . ."}</span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;