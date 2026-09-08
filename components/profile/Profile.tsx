"use client";

import {CHARACTERS} from "./data-local";
import Image from "next/image";
import {useState} from "react";
import {Pencil} from "lucide-react";
import CharacterPicker from "./CharacterPicker";

type ProfileProps = {
  username: string;
  avatarId: string;
  onAvatarChange: (newAvatarId: string) => void;
};

export default function Profile({username, avatarId, onAvatarChange}: ProfileProps) {
  const [showPicker, setShowPicker] = useState(false);
const character = CHARACTERS.find((character) => character.id === avatarId) ?? CHARACTERS[0];
  return (
    <>
    {/* Profile */}
        <div className="relative -mt-85 -ml-4 md:-mt-135 flex items-center">
            {/* Avatar */}
        <button
          type="button"
          className="relative w-12 h-12 md:w-24 md:h-24 z-10 shrink-0 cursor-pointer drop-shadow-lg"
          onClick={() => setShowPicker(true)}
          aria-haspopup="dialog"
          aria-expanded={showPicker}
          aria-label="Ganti karakter"
        >
          <Image
            src={character.src}
            alt={character.name}
            fill
            sizes="(min-width: 768px) 96px, 48px"
            className="object-contain object-bottom"
          />

          <div className="absolute -bottom-1 -right-1 bg-yellow-300 border-2 border-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow">
            <Pencil className="w-3 h-3 text-gray-600" />
          </div>
        </button>

        {/* Signboard */}
        <div className="aspect-3/2 w-40 md:w-90 relative overflow-hidden -ml-8 md:-ml-16">
          <div className="bg-[url(/img/wooden-signboard.png)] bg-no-repeat bg-contain bg-center absolute inset-0" />

          <div className="absolute inset-0 flex justify-center items-center">
            <h2 className="text-lg md:text-2xl font-bold text-[#211510] font-jaro drop-shadow">
              {username}
            </h2>
          </div>
        </div>
      </div>

      {/* Character Picker */}
        {showPicker && (
            <CharacterPicker 
             currentAvatarId={avatarId}
             onSelect={onAvatarChange}
             onClose={() => setShowPicker(false)}
            />
        )}
    </>
  )
}
