"use server";

import bcrypt from "bcryptjs";
import { NewPasswordSchemaType } from "@/components/auth/new-password-form";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import { db } from "@/lib/db";

export const newPassword = async (
  values: NewPasswordSchemaType,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid Token" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }
  const exisitngUser = await getUserByEmail(existingToken.email);

  if (!exisitngUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: exisitngUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { token },
  });
  
  return {
    success: "Password updated!",
  };
};
