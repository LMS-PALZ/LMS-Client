import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const registerStudentFieldsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm your password"),
});

export const registerStudentSchema = registerStudentFieldsSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  },
);

export type RegisterStudentFormValues = z.infer<typeof registerStudentSchema>;

export const registerTrainerSchema = registerStudentFieldsSchema
  .extend({
    skills: z.string().min(1, "List your skills"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterTrainerFormValues = z.infer<typeof registerTrainerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const submissionLinkSchema = z.object({
  url: z.string().url("Enter a valid URL"),
});

export const submissionTextSchema = z.object({
  text: z.string().min(1, "Enter your response").max(10_000),
});

export const courseDetailsStepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  durationHours: z.coerce.number().min(0).optional(),
});

export const gradeSubmissionSchema = z.object({
  score: z.coerce.number().min(0).max(100),
  feedback: z.string().min(1, "Feedback is required before saving"),
});

export type GradeSubmissionFormValues = z.infer<typeof gradeSubmissionSchema>;

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Phone number too long")
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, "");
        if (digits.startsWith("234")) {
          return digits.length >= 12 && digits.length <= 13;
        }
        return /^0[789]\d{9}$/.test(digits);
      },
      { message: "Use a valid Nigerian number (e.g. 08012345678)" },
    ),
  program: z.string().min(1, "Please select a program"),
});
