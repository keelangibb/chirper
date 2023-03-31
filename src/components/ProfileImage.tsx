import Image from "next/image";

export default function ProfileImage({
  user,
}: {
  user: {
    profileImageUrl: string;
    username: string;
  };
}) {
  return (
    <Image
      src={user.profileImageUrl}
      alt={`@${user.username}s profile image`}
      className="rounded-full"
      height={56}
      width={56}
    />
  );
}
