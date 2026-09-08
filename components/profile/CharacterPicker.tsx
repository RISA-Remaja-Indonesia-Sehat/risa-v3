"use client";

import Image from "next/image";
import { CHARACTERS } from "./data-local";

type CharacterPickerProps = {
  currentAvatarId: string;
  onSelect: (avatarId: string) => void;
  onClose: () => void;
};

export default function CharacterPicker({
  currentAvatarId,
  onSelect,
  onClose,
}: CharacterPickerProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-picker-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="character-picker-title"
        className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-jaro text-2xl text-pink-600">Pilih Karaktermu</h3>

        <div className="grid grid-cols-4 gap-3 w-full">
          {CHARACTERS.map((character) => {
            const isSelected = character.id === currentAvatarId;
            return (
              <button
                key={character.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  onSelect(character.id);
                  onClose();
                }}
                className={`
                    relative aspect-square w-full
                    rounded-2xl border-4
                    transition-transform
                    overflow-hidden
                    ${
                      isSelected
                        ? "scale-105 border-pink-400 shadow-lg"
                        : "border-transparent hover:scale-105 hover:border-pink-200"
                    }
                  `}
              >
                <Image
                  src={character.src}
                  alt={character.name}
                  fill
                  sizes="(min-width: 768px) 96px, 48px"
                  className="object-contain object-bottom"
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="text-sm text-gray-400 hover:text-gray-600 mt-1"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
