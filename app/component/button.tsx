const Button = () => {
  return (
    <button className="cursor-pointer">
      <div className="w-[63px] h-[63px] md:w-[83px] md:h-[83px] bg-pink-50 rounded-full relative shadow-[inset_0px_0px_1px_1px_rgba(0,0,0,0.3),_2px_3px_5px_rgba(0,0,0,0.1)] flex items-center justify-center">
        <div className="absolute w-[52px] h-[52px] md:w-[72px] md:h-[72px] z-10 bg-black rounded-full left-1/2 -translate-x-1/2 top-[5px] blur-[1px]" />
        <label className="group cursor-pointer absolute w-[52px] h-[52px] md:w-[72px] md:h-[72px] bg-gradient-to-b from-pink-600 to-pink-400 rounded-full left-1/2 -translate-x-1/2 top-[5px] shadow-[inset_0px_4px_2px_#f472b6,inset_0px_-4px_0px_#c2418c,0px_0px_2px_rgba(0,0,0,10)] active:shadow-[inset_0px_4px_2px_rgba(244,114,182,0.5),inset_0px_-4px_2px_rgba(194,65,140,0.5),0px_0px_2px_rgba(0,0,0,10)] z-20 flex items-center justify-center">
          <div className="w-6 md:w-8 group-active:w-[21px] md:group-active:w-[31px] fill-pink-100 drop-shadow-[0px_2px_2px_rgba(0,0,0,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24">
              <path d="M20.492,7.969,10.954.975A5,5,0,0,0,3,5.005V19a4.994,4.994,0,0,0,7.954,4.03l9.538-6.994a5,5,0,0,0,0-8.062Z" />
            </svg>
          </div>
        </label>
      </div>
    </button>
  );
}

export default Button;