import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-screen w-full bg-[url(/img/background-mobile.png)] md:bg-[url(/img/background-tablet.png)] lg:bg-[url(/img/background-desktop.png)] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center">
        <section className="flex flex-wrap items-center gap-2 w-full bg-red-500 z-10">
            <div className=" bg-sky-100 w-fit h-fit">
                <Image src='/img/pad.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/spoon.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/comb.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/dry-tissue.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/hand-sanitizer.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/plastic-bag.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/powerbank.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/snack-bar.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/toothbrush.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/wet-wipes.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/bottle.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/lipstick.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/pain-relief-patch.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/pants.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
            <div className=" bg-sky-100 w-fit h-fit top-0 left-20">
                <Image src='/img/teddy-bear.png' width={50} height={50} alt="Teacher" className="w-full max-w-sm"/>
            </div>
        </section>

        <div className="w-full h-full flex items-center justify-center">
            <Image src='/img/open-bag.png' width={250} height={250} alt="School Bag" className="w-full max-w-lg"/>
        </div>
    </div>
  )
}
