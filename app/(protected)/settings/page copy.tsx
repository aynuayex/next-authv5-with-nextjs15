"use client";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";
// import { useSession, 
//   signOut
//  } from "next-auth/react";

const SettingsPage = () => {
  const user = useCurrentUser();
  return (
    <div className="bg-white p-10 rounded-xl ">
      {/* <button onClick={() => signOut()} type="submit"> */}
      <button onClick={() => logout()} type="submit">
        Sign Out
      </button>
    </div>
  );
};

export default SettingsPage;

// import { auth, signOut } from "@/auth";

// const SettingsPage = async () => {
//   const session = await auth();
//   return (
//     <div>
//       {JSON.stringify(session)}
//       <form
//         action={async () => {
//           "use server";
//           await signOut({ redirectTo: '/auth/login' });
//         }}
//       >
//         <button type="submit">Sign Out</button>
//       </form>
//     </div>
//   );
// };

// export default SettingsPage;
