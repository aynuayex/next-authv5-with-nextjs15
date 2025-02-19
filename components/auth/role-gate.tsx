"use client";

import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/hooks/use-current-role";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

import { FormError } from "@/components/form-error";

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }
  return <>{children}</>;
};
