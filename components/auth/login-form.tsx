"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { CardWrapper } from "@/components/auth/card-wrapper";
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
import { login } from "@/actions/login";

export type LoginSchemaType = z.infer<typeof LoginSchema>;

const SearchParamsHandler = ({
  setCallbackUrl,
  setError,
}: {
  setCallbackUrl: (url: string | null) => void;
  setError: (msg: string) => void;
}) => {
  const searchParams = useSearchParams();

  // Use `useEffect` to safely set states
  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError =
      searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    setCallbackUrl(callbackUrl);
    setError(urlError);
  }, [searchParams, setCallbackUrl, setError]); 

  return null;
};

export const LoginForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [callbackUrl, setCallbackUrl] = useState<string | null>();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const OnSubmit = (values: LoginSchemaType) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      console.log({ callbackUrl });
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          setError(data.error);
        }

        if (data?.success) {
          setSuccess(data.success);
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      });
    });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Pass the setters to SearchParamsHandler */}
      <SearchParamsHandler
        setCallbackUrl={setCallbackUrl}
        setError={setError}
      />
      <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/auth/register"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
            <div className="space-y-4">
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two Factor Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123456"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="user@example.com"
                            type="email"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <Button
                          size={"sm"}
                          variant={"link"}
                          asChild
                          className="px-0 font-normal"
                        >
                          <Link href="/auth/reset">Forgot Password?</Link>
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit" className="w-full">
              {showTwoFactor ? "Confirm" : "Login"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </Suspense>
  );
};
