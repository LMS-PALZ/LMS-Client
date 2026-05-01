import { useMutation } from "@tanstack/react-query";

export function useResetPasswordMutation() {
    return useMutation({
        mutationFn: async (input: {
            email?: string;
            token?: string;
            password: string;
            confirmPassword: string;
        }) => {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    ok: false,
                    message: data.message || "Failed to reset password",
                };
            }

            return {
                ok: true,
                message: data.message || "Password reset successfully",
            };
        },
    });
}
