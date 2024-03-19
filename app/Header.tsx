import { useRouter } from "next/navigation";
import Image from "next/image";
import JackpotOn from "@/public/jackpot-on.png";
import JackpotOff from "@/public/jackpot-off.png";
import Back from "@/public/back.png";
import { useAppContext } from "@/reducers/AppReducer";

export const Header = ({ showJackpotSwitch = false }) => {
  const router = useRouter();
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex w-full justify-between items-center py-1 md:py-2">
      <button className="p-3 -m-3 md:p-5 md:-m-5 active:scale-95">
        <Image
          className="cursor-pointer md:w-10 md:h-10"
          width={25}
          height={25}
          src={Back}
          alt="back button"
          onClick={() => router.back()}
        />
      </button>
      {showJackpotSwitch && (
        <button className="p-3 -m-3 md:p-5 md:-m-5 active:scale-95">
          <Image
            className="cursor-pointer md:w-10 md:h-10"
            width={25}
            height={25}
            src={state.jackpotEnabled ? JackpotOn : JackpotOff}
            alt="back button"
            onClick={() =>
              dispatch({
                type: "setJackpotEnabled",
                payload: !state.jackpotEnabled,
              })
            }
          />
        </button>
      )}
    </div>
  );
};
