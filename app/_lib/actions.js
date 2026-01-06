"use server";

import { signIn, signOut } from "./auth";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// const handleGoogleSignIn = () => {
//   signIn('google', { callbackUrl: '/dashboard' });
// };

// const handleGitHubSignIn = () => {
//   signIn('github', { callbackUrl: '/dashboard' });
// };
