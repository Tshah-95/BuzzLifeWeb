import { useRouter } from "next/navigation";
import Image from "next/image";
import Back from "@/public/back.png";
import Settings from "@/public/settings.png";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="flex w-full justify-between items-center">
      <div className="p-3 -m-3">
        <Image
          className="cursor-pointer"
          width={25}
          height={25}
          src={Back}
          alt="back button"
          onClick={() => router.back()}
        />
      </div>
      <div className="p-3 -m-3">
        <Image
          className="cursor-pointer"
          width={25}
          height={25}
          src={Settings}
          alt="settings button"
          onClick={() => router.back()}
        />
      </div>
    </div>
  );
};