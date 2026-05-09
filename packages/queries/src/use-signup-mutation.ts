import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupStudent, writeSession } from "@ssu/api";
import { sessionKey } from "./keys";
import type { SignUpFormValues } from "@ssu/schema";

export function useSignupMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: SignUpFormValues) => {
            const res = await signupStudent(input, "student");
            return res;
        },
        onSuccess: (data) => {
            if (!data.ok) return;
            writeSession(data.user);
            void qc.setQueryData(sessionKey, data.user);
        },
    });
}
