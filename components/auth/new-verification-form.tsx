"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BeatLoader } from "react-spinners";
import { CardWrapper } from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

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

const NewVerificationForm = () => {
  const loadedOnceRef = useRef<boolean>(false);
  const [token, setToken] = useState<string | null>();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        // TODO: instead of showing a success message,
        // simply navigate to login with success toast message.
        // that should also eliminate the need for fix of React.strictMode
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    if (!loadedOnceRef.current && token !== undefined) {
      onSubmit();
      loadedOnceRef.current = true;
    }
  }, [onSubmit, token]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Pass the setters to SearchParamsHandler */}
      <SearchParamsHandler setToken={setToken} />
      <CardWrapper
        headerLabel="Confirming your Verification"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
      >
        <div className="w-full flex items-center justify-center">
          {!success && !error && <BeatLoader />}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>
      </CardWrapper>
    </Suspense>
  );
};

export default NewVerificationForm;
