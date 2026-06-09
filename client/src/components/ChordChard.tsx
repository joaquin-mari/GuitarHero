export default function ChordCard({ chord }: { chord: string }) {
  return (
    <div className="text-center p-10 border rounded-xl shadow">
      <h1 className="text-5xl font-bold">{chord}</h1>
    </div>
  );
}
