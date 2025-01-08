"use server";

import { ResetSchemaType } from "@/components/auth/reset-form";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";

export const reset = async (values: ResetSchemaType) => {
  const validateFields = ResetSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const PasswordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    PasswordResetToken.email,
    PasswordResetToken.token,
  )

  return { success: "Reset email sent!" };
};
