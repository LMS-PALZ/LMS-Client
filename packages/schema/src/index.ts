import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),

  rememberMe: z
    .union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "on")
    .optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const baseUserFields = z.object({
  firstName: z.string().min(1, "First name is required"),

  lastName: z.string().min(1, "Last name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z.string().min(8, "Use at least 8 characters"),

  confirmPassword: z.string().min(1, "Confirm your password"),
});

export const registerStudentSchema = baseUserFields.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords must match",
    path: ["confirmPassword"],
  },
);

export type RegisterStudentFormValues = z.infer<typeof registerStudentSchema>;

export const registerTrainerSchema = baseUserFields
  .extend({
    skills: z.string().min(1, "List your skills"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type RegisterTrainerFormValues = z.infer<typeof registerTrainerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const acceptInviteSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),

    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),

    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;

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

export const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),

  last_name: z.string().min(1, "Last name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  phone_number: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .refine((val) => /^\d+$/.test(val), {
      message: "Phone number must contain only numbers",
    })
    .refine((val) => val.length === 11, {
      message: "Phone number must be exactly 11 digits",
    }),

  program: z.string().min(1, "Please select a course"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const confirmCodeSchema = z.object({
  code: z.string().min(1, "Confirmation code is required"),
});

export type ConfirmCodeFormValues = z.infer<typeof confirmCodeSchema>;

export const resendCodeSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type ResendCodeFormValues = z.infer<typeof resendCodeSchema>;

const MIN_PROFILE_AGE = 15;

export const accountSetupStepOneSchema = z
  .object({
    day: z.string(),
    month: z.string(),
    year: z.string(),
    gender: z.string().min(1, "Please select your gender"),
    employmentStatus: z.string().min(1, "Please select your employment status"),
  })
  .refine((data) => !!data.day && !!data.month && !!data.year, {
    path: ["dateOfBirth"],
    message: "Please enter your date of birth",
  })
  .refine(
    (data) => {
      const day = Number.parseInt(data.day, 10);
      const year = Number.parseInt(data.year, 10);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthIndex = months.indexOf(data.month);
      if (!Number.isFinite(day) || !Number.isFinite(year) || monthIndex < 0) {
        return false;
      }
      const birthDate = new Date(year, monthIndex, day);
      if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== monthIndex ||
        birthDate.getDate() !== day
      ) {
        return false;
      }
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age -= 1;
      }
      return age >= MIN_PROFILE_AGE;
    },
    {
      path: ["dateOfBirth"],
      message:
        "You are not up to the required age to register. You must be at least 15 years old.",
    },
  );

export type AccountSetupStepOneValues = z.infer<
  typeof accountSetupStepOneSchema
>;

export const accountSetupStepTwoSchema = z.object({
  address: z.string().trim().min(1, "Please enter your address"),
  stateOfResidence: z
    .string()
    .trim()
    .min(1, "Please select your state of residence"),
  city: z.string().trim().min(1, "Please enter your city"),
});

export type AccountSetupStepTwoValues = z.infer<
  typeof accountSetupStepTwoSchema
>;

function isFileLike(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "size" in value &&
    "type" in value
  );
}

export const accountSetupStepThreeSchema = z.object({
  profilePhoto: z
    .custom<File>(isFileLike, {
      message: "Please upload your profile photo",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Your photo must be 2MB or less",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Please upload a valid image file",
    }),
});

export type AccountSetupStepThreeValues = z.infer<
  typeof accountSetupStepThreeSchema
>;

export const inviteStaffSchema = z.object({
  first_name: z.string().min(1, "First name is required"),

  last_name: z.string().min(1, "Last name is required"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
});

export type InviteStaffFormValues = z.infer<typeof inviteStaffSchema>;
