"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useButtonGameState } from "@/app/store/useButtonGame";
import { useRouter, usePathname} from 'next/navigation';

export default function ModuleCard({ moduleData }: { moduleData: Record<string, string> }) {
  const [currentCard, setCurrentCard] = useState(1);
  
  const cards = Object.values(moduleData);
  const totalCards = cards.length;

  const nextCard = () => {
    if (currentCard < totalCards) setCurrentCard(currentCard + 1);
  };

  const prevCard = () => {
    if (currentCard > 1) setCurrentCard(currentCard - 1);
  };

  const router = useRouter();
  const pathname = usePathname();
  function showGamePage() {
    useButtonGameState.getState().activateButtonGame();
    const buttonState = useButtonGameState.getState().isButtonGameActive;
    console.log(buttonState);
    if(buttonState === true) router.push(`${pathname}/game`);
  };

  return (
    <div>
      <div 
        className="text-gray-800 leading-relaxed mb-6 touch-pan-y font-jakarta"
        dangerouslySetInnerHTML={{ __html: cards[currentCard - 1] }}
      />

      {currentCard === totalCards && (
        <div className="flex justify-center my-5">
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 text-sm lg:text-lg" id="game" onClick={showGamePage}>
            Let&apos;s goooo~ 
          </button>
        </div>
      )}
      
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={prevCard}
          disabled={currentCard === 1}
          className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="w-[63px] h-[63px] md:w-[83px] md:h-[83px] bg-pink-50 rounded-full relative shadow-[inset_0px_0px_1px_1px_rgba(0,0,0,0.3),_2px_3px_5px_rgba(0,0,0,0.1)] flex items-center justify-center">
            <div className="absolute w-[52px] h-[52px] md:w-[72px] md:h-[72px] z-10 bg-black rounded-full left-1/2 -translate-x-1/2 top-[5px] blur-[1px]" />
            <div className="group cursor-pointer absolute w-[52px] h-[52px] md:w-[72px] md:h-[72px] bg-gradient-to-b from-pink-600 to-pink-400 rounded-full left-1/2 -translate-x-1/2 top-[5px] shadow-[inset_0px_4px_2px_#f472b6,inset_0px_-4px_0px_#c2418c,0px_0px_2px_rgba(0,0,0,10)] active:shadow-[inset_0px_4px_2px_rgba(244,114,182,0.5),inset_0px_-4px_2px_rgba(194,65,140,0.5),0px_0px_2px_rgba(0,0,0,10)] z-20 flex items-center justify-center text-pink-100 text-3xl font-bold drop-shadow-[0px_2px_2px_rgba(0,0,0,0.5)]">
              <ArrowLeft className="w-6 h-6" />
            </div>
          </div>
        </button>
        
        <span className="text-sm text-gray-600">
          {currentCard} / {totalCards}
        </span>
        
        <button 
          onClick={nextCard}
          disabled={currentCard === totalCards}
          className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="w-[63px] h-[63px] md:w-[83px] md:h-[83px] bg-pink-50 rounded-full relative shadow-[inset_0px_0px_1px_1px_rgba(0,0,0,0.3),_2px_3px_5px_rgba(0,0,0,0.1)] flex items-center justify-center">
            <div className="absolute w-[52px] h-[52px] md:w-[72px] md:h-[72px] z-10 bg-black rounded-full left-1/2 -translate-x-1/2 top-[5px] blur-[1px]" />
            <div className="group cursor-pointer absolute w-[52px] h-[52px] md:w-[72px] md:h-[72px] bg-gradient-to-b from-pink-600 to-pink-400 rounded-full left-1/2 -translate-x-1/2 top-[5px] shadow-[inset_0px_4px_2px_#f472b6,inset_0px_-4px_0px_#c2418c,0px_0px_2px_rgba(0,0,0,10)] active:shadow-[inset_0px_4px_2px_rgba(244,114,182,0.5),inset_0px_-4px_2px_rgba(194,65,140,0.5),0px_0px_2px_rgba(0,0,0,10)] z-20 flex items-center justify-center text-pink-100 text-3xl font-bold drop-shadow-[0px_2px_2px_rgba(0,0,0,0.5)]">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
