import { Heart } from 'lucide-react';

export default function FavoriteButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
        active ? 'bg-rose-900/20 border border-rose-400/30 text-rose-300' : 'bg-white/[0.05] border border-white/[0.08] text-ash hover:text-cream hover:border-rose-400/30'
      }`}
    >
      <Heart className={`h-3.5 w-3.5 ${active ? 'fill-rose-300 text-rose-300' : ''}`} />
      {active ? 'Favorited' : 'Favorite'}
    </button>
  );
}
