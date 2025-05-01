import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { interviewCovers, mappings } from "@/constants";

// Function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.14.0/icons/";

// Normalize tech name for logo retrieval
const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

// Function to get tech logos dynamically
export const getTechLogos = async (techStack: string[]) => {
  return techStack.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}${normalized}/${normalized}-original.svg`,
    };
  });
};

// Function to randomly select an interview cover image
export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return interviewCovers[randomIndex];
};