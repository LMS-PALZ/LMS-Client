"use client";

import { adminPath } from "@ssu/config/portal-paths";
import { ShieldCheck, Users, BookOpen, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AdminWelcomeProps {
  title?: string;
  description?: string;
}

export function HomePage({
  title = "Welcome to the admin dashboard",
  description = "This is the secure back office for managing Skill Scale Up students, programs, and trainers.",
}: AdminWelcomeProps) {
  const features = [
    {
      title: "Students",
      icon: Users,
      href: adminPath("/students"),
    },
    {
      title: "Programs",
      icon: BookOpen,
      href: adminPath("/courses"),
    },
    {
      title: "Trainers",
      icon: Monitor,
      href: adminPath("/staff"),
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
          Secure admin access
        </span>
      </div>

      <h1 className="mt-5 text-[18px] font-semibold md:text-[25px]">{title}</h1>

      <p className="mt-3 max-w-[760px] text-[17px] leading-[40px] text-[#BDBDBD]">
        {description}
      </p>

      <div className="my-12 h-[3px] w-[100px] rounded-full bg-gray-500" />

      <div className="grid w-full gap-6 md:grid-cols-3">
        {features.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col items-center justify-center rounded-[20px] border border-[#BDBDBD] py-8 text-[#737373] transition hover:border-[#4C7D5B] hover:bg-[#F5F9F6] hover:text-[#4C7D5B]"
            >
              <h3 className="mb-3 text-[18px] font-medium">{item.title}</h3>
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
