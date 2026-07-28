import { Heart, Star, Sparkles } from 'lucide-react';

const favorites = [
  { name: 'Cognitive Chain', tag: 'Reasoning', desc: 'Multi-step logical inference with traceability.', rating: 4.9 },
  { name: 'Synthesized Reports', tag: 'Synthesis', desc: 'Merge divergent sources into coherent outputs.', rating: 4.8 },
  { name: 'Agent Mesh', tag: 'Orchestration', desc: 'Coordinate autonomous workflows at scale.', rating: 4.7 },
];

export default function FavoritesSection() {
  return (
    <section aria-label="Favorite tools" className="mb-10">
      <h2 className="font-sans text-xl font-extrabold text-cream tracking-tight mb-4 flex items-center gap-2"><Heart className="h-5 w-5 text-rose-400" /> Favorites</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {favorites.map((f) => (
          <div key={f.name} className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-card/50 to-ink p-6 hover:border-gold/20 transition-all shadow-sm hover:shadow-lg hover:shadow-black/10">
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-md bg-gold-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-gold">{f.tag}</span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300"><Star className="h-3 w-3 fill-amber-300" /> {f.rating}</span>
            </div>
            <h3 className="font-sans text-lg font-extrabold text-cream tracking-tight mb-1">{f.name}</h3>
            <p className="text-sm text-ash leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
