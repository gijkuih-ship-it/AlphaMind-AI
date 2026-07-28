import FavoritesSection from '../components/FavoritesSection';

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95] mb-4">Favorites</h1>
      <p className="text-ash mb-10">Your saved AI modules and quick-access tools.</p>
      <FavoritesSection />
    </main>
  );
}
