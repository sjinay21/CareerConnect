import Card from "@/components/shared/card";
import { useProfile } from "@/hooks/useProfile";

export default function Profile() {
  const { profile } = useProfile();

  return (
    <Card padding={0}>
      <div className="relative h-[110px]">
        <div className="relative w-full h-[80px] rounded-md">
          <img
            src="/images.jpg"
            alt="profile"
            className="rounded-t-md h-full w-full object-cover"
          />
        </div>
        <div className="absolute top-10 left-6 z-10">
          <img
            src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
            alt="image"
            className="rounded-full border-2 h-16 w-16 border-white cursor-pointer object-cover"
          />
        </div>
      </div>
      <div className="p-5 mt-3">
        <div className="text-xl font-semibold">{profile.name}</div>
        <div className="text-sm my-1 text-gray-700">{profile.summary}</div>
        <div className="text-sm my-1 text-gray-500">{profile.location}</div>
      </div>
    </Card>
  );
}
