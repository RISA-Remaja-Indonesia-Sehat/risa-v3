import Image from "next/image";
import Character from "./character";

export default function Scene({ background, pose, eyes, mouth }: { background: string; pose: string; eyes: string; mouth: string }) {
  return (
    <div className="relative w-full h-screen">
      <Image
        src={`/img/character/backgrounds/${background}.png`}
        className="absolute w-full h-full object-cover"
        width={1920}
        height={1080}
        alt="Background"
      />

      <div className="absolute left-10 bottom-10">
        <Character pose={pose} eyes={eyes} mouth={mouth} />
      </div>

      <div className="absolute right-0 w-1/3 h-full bg-gradient-to-l from-white/80 to-transparent p-8">
        {/* Feedback text here */}
      </div>
    </div>
  );
}