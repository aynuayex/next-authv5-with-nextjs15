"use client";
import { signIn } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

const SearchParamsHandler = ({
  setCallbackUrl,
}: {
  setCallbackUrl: (url: string | null) => void;
}) => {
  const searchParams = useSearchParams();

  // Use `useEffect` to safely set states
  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl");

    setCallbackUrl(callbackUrl);
  }, [searchParams, setCallbackUrl]);

  return null;
};

export const Social = () => {
  const [callbackUrl, setCallbackUrl] = useState<string | null>();

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Pass the setters to SearchParamsHandler */}
      <SearchParamsHandler setCallbackUrl={setCallbackUrl} />
      <div className="flex items-center w-full gap-x-2">
        <Button
          size={"lg"}
          className="w-full"
          variant={"outline"}
          onClick={() => onClick("google")}
        >
          <FcGoogle className="w-5 h-5 " />
        </Button>
        <Button
          size={"lg"}
          className="w-full"
          variant={"outline"}
          onClick={() => onClick("github")}
        >
          <FaGithub className="w-5 h-5 " />
        </Button>
      </div>
    </Suspense>
  );
};
