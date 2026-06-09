// src/components/Controls.tsx
export default function Controls({
  onNext,
  onSave,
}: {
  onNext: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex gap-4 mt-6 justify-center">
      <button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={onNext}
      >
        Next Chord
      </button>

      <button className="px-4 py-2 border rounded" onClick={onSave}>
        Save Session
      </button>
    </div>
  );
}
