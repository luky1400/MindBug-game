import { CardTile } from "./CardTile";

interface HandPanelProps {
  cards: string[];
  selectedIndex: number | null;
  selectable?: boolean;
  onSelect: (index: number) => void;
  onPreview: (label: string) => void;
  animatedIndices?: Set<number>;
  unplayableIndices?: Set<number>;
  unplayableTitle?: string;
}

export function HandPanel({
  cards,
  selectedIndex,
  selectable = true,
  onSelect,
  onPreview,
  animatedIndices,
  unplayableIndices,
  unplayableTitle = "This card cannot be played right now."
}: HandPanelProps) {
  return (
    <div className="hand-row">
      {cards.length === 0 ? (
        <div className="placeholder">No cards</div>
      ) : (
        cards.map((label, index) => {
          const isUnplayable = unplayableIndices?.has(index) ?? false;
          return (
            <CardTile
              key={`${label}-${index}`}
              label={label}
              selected={selectedIndex === index}
              clickable={selectable}
              disabled={isUnplayable}
              disabledTitle={unplayableTitle}
              size="medium"
              onClick={selectable && !isUnplayable ? () => onSelect(index) : undefined}
              onDoubleClick={() => onPreview(label)}
              animationClass={animatedIndices?.has(index) ? "card-tile-draw-anim" : ""}
            />
          );
        })
      )}
    </div>
  );
}
