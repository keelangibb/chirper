import { type User } from "@clerk/nextjs/dist/api";

export function filterUserForClient(user: User) {
  const { id, username, profileImageUrl } = user;
  return {
    id,
    username,
    profileImageUrl,
  };
}
