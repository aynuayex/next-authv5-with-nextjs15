"use client";

import * as z from "zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";
import { Suspense, useEffect, useState, useTransition } from "react";

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;

const SearchParamsHandler = ({
  setToken,
}: {
  setToken: (url: string | null) => void;
}) => {
  const searchParams = useSearchParams();

  // Use `useEffect` to safely set states
  useEffect(() => {
    const token = searchParams.get("token");

    setToken(token);
  }, [searchParams, setToken]);

  return null;
};

export const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [token, setToken] = useState<string | null>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const OnSubmit = (values: NewPasswordSchemaType) => {
    setError("");
    setSuccess("");

    console.log(values);
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        // TODO: Add when we add 2FA
        setSuccess(data?.success);
      });
    });
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Pass the setters to SearchParamsHandler */}
      <SearchParamsHandler setToken={setToken} />
      <CardWrapper
        headerLabel="Enter a new  password?"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </Suspense>
  );
};
