"use client";

import { ShieldCheck, Users, BookOpen, Monitor } from "lucide-react";
import { motion } from "framer-motion";
interface TutorWelcomeProps {
  title?: string;
  description?: string;
}

export function HomePage({
  title = "Welcome to the tutor dashboard",
  description = "This is the secure back office for managing Skill Scale Up students and programs.",
}: TutorWelcomeProps) {
  const features = [
    {
      title: "Students",
      icon: Users,
    },
    {
      title: "Programs",
      icon: BookOpen,
    },
    {
      title: "Admins",
      icon: Monitor,
    },
  ];

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
      <motion.div
        className="flex h-[120px] w-[120px] items-center justify-center"
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <img
          src="/firstlogo.png"
          alt="Skill Scale Up Logo"
          className="h-full w-full object-contain"
        />
      </motion.div>

      <div className="mt-8 rounded-full bg-[#0E5B1E] px-6 py-2">
        <span className="flex items-center gap-2 text-[16px] font-medium text-[#B7FFB0]">
          <ShieldCheck size={16} />
          Secure tutor access
        </span>
      </div>

      <h1 className="mt-5 text-[18px] font-semibold md:text-[25px]">{title}</h1>

      <p className="mt-3 max-w-[760px] text-[17px] leading-[40px] text-[#BDBDBD]">
        {description}
      </p>

      <div className="my-12 h-[3px] w-[100px] bg-gray-500 rounded-full" />

      <div className="grid w-full gap-6 md:grid-cols-3">
        {features.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex py-8 flex-col items-center justify-center rounded-[20px] border border-[#BDBDBD] text-[#737373]"
            >
              <h3 className="mb-3 text-[18px] font-medium ">{item.title}</h3>

              <Icon size={20} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
