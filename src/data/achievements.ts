import { Award, Star, CheckCircle2, Users, Monitor, Activity } from "lucide-react";
import type { Achievement } from "@/types/content";

export const achievements: Achievement[] = [
  {
    id: "national-ai-hackathon",
    icon: Award,
    year: "2026",
    name: "National AI Hackathon — Winner, Medicine Track",
    context: "Led team behind Ko'zNur, an AI system for diabetic retinopathy detection",
  },
  {
    id: "vorislari-startup-competition",
    icon: Star,
    year: "2026",
    name: "“Mirzo Ulug‘bek Vorislari” Startup Competition — Finalist",
    context: "Earned $500 in total prizes",
  },
  {
    id: "president-tech-award",
    icon: CheckCircle2,
    year: "2025",
    name: "President Tech Award — Finalist",
    context: "Top 52 of 600+ startups, with Salen Academy",
  },
  {
    id: "ixtirochilikka-qadam-olympiad",
    icon: Users,
    year: "2025",
    name: "“Ixtirochilikka Qadam” Olympiad — Finalist",
    context: "Top 5 of 2,000+ entrants, ~$5,000 in investment",
  },
  {
    id: "robocoding-olympiad",
    icon: Monitor,
    year: "2025",
    name: "Robocoding Olympiad — Finalist",
    context: "Top 4 of 42 teams, working mini-catapult",
  },
  {
    id: "cansat-wso",
    icon: Activity,
    year: "2024",
    name: "CanSat by WSO — Finalist",
    context: "Top 12 of 200 teams, Kazakhstan",
  },
];
