import Vapi from "@vapi-ai/web";

// Debugging: Check if environment variables are correctly loaded
console.log("Assistant ID:", process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
console.log("Squad ID:", process.env.NEXT_PUBLIC_VAPI_SQUAD_ID);

export const vapi = new Vapi(
    process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ?? "",
    process.env.NEXT_PUBLIC_VAPI_SQUAD_ID ?? ""
);