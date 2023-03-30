import { type User } from "@clerk/nextjs/dist/api";

export function filterUserForClient(user: User) {
  const { id, username, profileImageUrl } = user;
  return {
    id,
    username,
    profileImageUrl,
  };
}

export function test() {
  const queryParams = new URLSearchParams(document.location.search);
  const redirectUrl = queryParams.get("url");
  if (!redirectUrl) return;
  document.location = redirectUrl; // Noncompliant
}
