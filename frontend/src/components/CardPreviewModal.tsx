import { cardImageUrl } from "../utils/cards";

interface CardPreviewModalProps {
  label: string | null;
  onClose: () => void;
}

export function CardPreviewModal({ label, onClose }: CardPreviewModalProps) {
  if (!label) return null;

  return (
    <div className="overlay overlay-choice overlay-choice-centered overlay-no-backdrop" onClick={onClose}>
      <div className="mindbug-overlay-content" onClick={(event) => event.stopPropagation()}>
        <img
          className="preview-image mindbug-overlay-image"
          src={cardImageUrl(label)}
          alt={label}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-outline-light" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
