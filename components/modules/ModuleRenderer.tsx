import type {
  CalloutVariant,
  ListTone,
  ModuleBlock,
} from "@/lib/modules/types";

type Props = {
  blocks: ModuleBlock[];
};

const calloutStyles:
  Record<
    CalloutVariant,
    string
  > = {
  concept:
    "border-pink-200 bg-pink-50 text-pink-900",

  remember:
    "border-yellow-200 bg-yellow-50 text-yellow-900",

  tip:
    "border-emerald-200 bg-emerald-50 text-emerald-900",

  warning:
    "border-rose-200 bg-rose-50 text-rose-900",

  summary:
    "border-sky-200 bg-sky-50 text-sky-900",
};

const calloutIcons:
  Record<
    CalloutVariant,
    string
  > = {
  concept: "🌱",
  remember: "💡",
  tip: "✨",
  warning: "⚠️",
  summary: "🎯",
};

const listDotStyles:
  Record<
    ListTone,
    string
  > = {
  pink: "bg-pink-300",
  yellow: "bg-yellow-400",
  green: "bg-emerald-400",
  blue: "bg-sky-300",
  neutral: "bg-zinc-300",
};

export default function ModuleRenderer({
  blocks,
}: Props) {
  return (
    <div
      className="
        space-y-7
        font-jakarta
      "
    >
      {blocks.map(
        (block, index) => {
          const key =
            `${block.type}-${index}`;

          switch (
            block.type
          ) {
            case "paragraph":
              return (
                <p
                  key={key}
                  className="
                    text-sm
                    leading-7
                    text-zinc-600

                    md:text-[17px]
                    md:leading-8
                  "
                >
                  {block.text}
                </p>
              );

            case "subheading":
              return (
                <h3
                  key={key}
                  className="
                    font-jaro

                    text-xl
                    text-pink-600

                    md:text-2xl
                  "
                >
                  {block.text}
                </h3>
              );

            case "list": {
              const dotClass =
                listDotStyles[
                  block.tone ??
                    "pink"
                ];

              return (
                <ul
                  key={key}
                  className="
                    space-y-3
                  "
                >
                  {block.items.map(
                    (
                      item,
                      itemIndex
                    ) => (
                      <li
                        key={
                          `${key}-${itemIndex}`
                        }
                        className="
                          flex
                          gap-3

                          text-sm
                          leading-7
                          text-zinc-600

                          md:text-[17px]
                          md:leading-8
                        "
                      >
                        {block.ordered ? (
                          <span
                            className="
                              font-semibold
                              text-pink-500
                            "
                          >
                            {itemIndex +
                              1}
                            .
                          </span>
                        ) : (
                          <span
                            className={`
                              mt-3
                              h-1.5
                              w-1.5

                              shrink-0

                              rounded-full

                              ${dotClass}
                            `}
                          />
                        )}

                        <span>
                          {item}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              );
            }

            case "callout":
              return (
                <div
                  key={key}
                  className={`
                    rounded-2xl

                    border-2

                    p-5

                    ${calloutStyles[
                      block.variant
                    ]}
                  `}
                >
                  <h3
                    className="
                      font-jaro

                      text-xl

                      md:text-2xl
                    "
                  >
                    {
                      calloutIcons[
                        block
                          .variant
                      ]
                    }{" "}
                    {block.title}
                  </h3>

                  {block.text && (
                    <p
                      className="
                        mt-2

                        text-sm
                        leading-7

                        md:text-base
                      "
                    >
                      {block.text}
                    </p>
                  )}

                  {block.items && (
                    <ul
                      className="
                        mt-3
                        space-y-2
                      "
                    >
                      {block.items.map(
                        (
                          item,
                          itemIndex
                        ) => (
                          <li
                            key={
                              `${key}-callout-${itemIndex}`
                            }
                            className="
                              flex
                              gap-2

                              text-sm
                              leading-6

                              md:text-base
                            "
                          >
                            <span>
                              •
                            </span>

                            <span>
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              );

            case "image":
              return (
                <figure
                  key={key}
                  className="
                    space-y-2
                  "
                >
                  <img
                    src={
                      block.src
                    }
                    alt={
                      block.alt
                    }
                    className="
                      w-full
                    "
                  />

                  {block.caption && (
                    <figcaption
                      className="
                        text-center

                        text-xs
                        text-zinc-500
                      "
                    >
                      {
                        block.caption
                      }
                    </figcaption>
                  )}
                </figure>
              );

            case "link":
              return (
                <div
                  key={key}
                  className="
                    rounded-2xl

                    border-2
                    border-pink-100

                    bg-white

                    p-4
                  "
                >
                  {block.description && (
                    <p
                      className="
                        mb-2

                        text-sm
                        leading-6
                        text-zinc-600
                      "
                    >
                      {
                        block.description
                      }
                    </p>
                  )}

                  <a
                    href={
                      block.href
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      font-semibold
                      text-pink-600

                      underline
                      underline-offset-4

                      transition

                      hover:text-pink-700
                    "
                  >
                    {block.label}
                    {" ↗"}
                  </a>
                </div>
              );

            default:
              return null;
          }
        }
      )}
    </div>
  );
}