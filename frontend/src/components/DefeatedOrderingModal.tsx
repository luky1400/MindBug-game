import type { PendingDefeatedOrderingState } from "../types/game";
import { cardImageUrl } from "../utils/cards";

interface DefeatedOrderingModalProps {
  pending: PendingDefeatedOrderingState;
  orderedIndices: number[];
  onSelect: (index: number) => void;
  onReset: () => void;
  onConfirm: () => void;
  onHide: () => void;
}

export function DefeatedOrderingModal({
  pending,
  orderedIndices,
  onSelect,
  onReset,
  onConfirm,
  onHide,
}: DefeatedOrderingModalProps) {
  if (!pending.response_required_from_viewer) return null;

  const allOrdered = orderedIndices.length === pending.entries.length;

  return (
    <div className="overlay overlay-choice overlay-choice-centered">
      <div className="choice-overlay-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-center mb-2">Choose DEFEATED action trigger order</h3>
        <p className="text-center text-muted mb-3" style={{ fontSize: "0.9rem" }}>
          Click cards in the order you want their DEFEATED effects to trigger.
        </p>
        <div className="choice-options-grid mt-2">
          {pending.entries.map((entry, index) => {
            const orderPosition = orderedIndices.indexOf(index);
            const isOrdered = orderPosition !== -1;

            return (
              <div key={`${entry.card_label}-${index}`} className="defeated-ordering-item">
                <button
                  className={`choice-preview-button ${isOrdered ? "defeated-ordering-selected" : ""}`}
                  onClick={() => {
                    if (!isOrdered) onSelect(index);
                  }}
                  type="button"
                >
                  {isOrdered ? (
                    <span className="defeated-order-badge">{orderPosition + 1}</span>
                  ) : null}
                  <img
                    className="preview-image choice-preview-image"
                    src={cardImageUrl(entry.card_label)}
                    alt={entry.card_label}
                    style={isOrdered ? { opacity: 0.5 } : undefined}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </button>
                <div className="defeated-ordering-owner">
                  {entry.owner_name}'s card
                </div>
              </div>
            );
          })}
        </div>
        <div className="selection-box mt-3 text-center">
          Ordered: {orderedIndices.length}/{pending.entries.length}
        </div>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button className="btn btn-outline-secondary" onClick={onHide} type="button">
            Hide for now
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={onReset}
            type="button"
            disabled={orderedIndices.length === 0}
          >
            Reset order
          </button>
          <button
            className="btn btn-outline-light"
            onClick={onConfirm}
            type="button"
            disabled={!allOrdered}
          >
            Confirm order
          </button>
        </div>
      </div>
    </div>
  );
}
