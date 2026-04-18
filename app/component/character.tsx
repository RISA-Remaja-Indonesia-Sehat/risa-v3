import Image from "next/image";

export default function Character({ pose, eyes, mouth }: { pose: string; eyes: string; mouth: string }) {
  return (
    <div className="relative w-[400px]">
      <Image src={`/img/character/poses/${pose}.png`} width={1024} height={1024} alt="Pose Character" />
      <Image
        src={`/img/character/eyes/${eyes}.png`}
        className="absolute top-8 left-40"
        width={80}
        height={80}
        alt="Eyes Character"
      />
      <Image
        src={`/img/character/mouth/${mouth}.png`}
        className="absolute top-13 left-40"
        width={80}
        height={80}
        alt="Mouth Character"
      />
    </div>
  );
}