import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[url(/img/sunflower.png)] bg-no-repeat bg-cover bg-center bg-scroll w-full h-full px-5 py-80 md:py-120 m-0">
        <div className="relative -mt-88 -ml-8 md:-mt-135 aspect-3/2 w-40 md:w-90 overflow-hidden">
            <div className="bg-[url(/img/wooden-signboard.png)] bg-no-repeat bg-contain bg-center absolute inset-0 top-0 left-0"></div>
            <div className="absolute inset-0 flex justify-center items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white font-jaro">Rosie</h2>
            </div>
        </div>

        <div className="bg-red-300 w-full h-60 md:h-120 lg:h-160 mt-10 md:mt-20 lg:mt-80 items-center justify-center flex">
            <p className="text-white text-xl">Post Test</p>
        </div>

        <div className="overflow-x-hidden mt-30">
            <Link
             href="/chapter7"
             className="relative w-3/4 aspect-3/2 flex justify-center items-center ml-28 md:ml-72 lg:ml-135">
                <div className="right-leaf"></div>
                <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-jaro">Chapter 7</p>
                </div>
            </Link>
        </div>

        <div>
            <Link 
             href='/chapter6' 
             className="relative w-3/4 aspect-3/2 flex justify-center items-center -ml-10 md:-ml-20 lg:-ml-40">
                <div className="left-leaf"></div>
                <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-jaro">Chapter 6</p>
                </div>
            </Link>
        </div>

        <div className="overflow-x-hidden">
            <Link
             href='/chapter5'
             className="relative w-3/4 aspect-3/2 flex justify-center items-center ml-28 md:ml-72 lg:ml-135">
                <div className="right-leaf"></div>
                <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-jaro">Chapter 5</p>
                </div>
            </Link>
        </div>

        <div>
            <Link
             href='/chapter4'
             className="relative w-3/4 aspect-3/2 flex justify-center items-center -ml-10 md:-ml-20 lg:-ml-40">
                <div className="left-leaf"></div>
                <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-jaro">Chapter 4</p>
                </div>
            </Link>
        </div>

        <div className="overflow-x-hidden">
            <Link
             href='/chapter3'
             className="relative w-3/4 aspect-3/2 flex justify-center items-center ml-28 md:ml-72 lg:ml-135">
                <div className="right-leaf"></div>
                <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-jaro">Chapter 3</p>
                </div>
            </Link>
        </div>

        <div>
            <Link
             href='/chapter2'
             className="relative w-3/4 aspect-3/2 flex justify-center items-center -ml-10 md:-ml-20 lg:-ml-40">
                <div className="left-leaf"></div>
                <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-jaro">Chapter 2</p>
                </div>
            </Link>
        </div>

        <div className="overflow-x-hidden">
            <Link
             href='/chapters/chapter1'
             className="relative w-3/4 aspect-3/2 flex justify-center items-center ml-28 md:ml-72 lg:ml-135">
                <div className="right-leaf"></div>
                <div className="relative z-10">
                    <p className="text-2xl md:text-3xl font-jaro">Chapter 1</p>
                </div>
            </Link>
        </div>

        {/* <div>
            <div className="relative w-3/4 aspect-3/2 flex justify-center items-center -ml-10 md:-ml-20">
                <div className="left-leaf"></div>
                <div className="relative z-10">
                    <p className="text-white text-xl relative z-10">Pre Test</p>
                </div>
            </div>
        </div> */}
  
    </div>
  )
}
