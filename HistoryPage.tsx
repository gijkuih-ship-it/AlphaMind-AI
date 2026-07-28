import ActivityHistory from '../components/ActivityHistory';

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
      <h1 className="font-sans text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-cream leading-[0.95] mb-4">History</h1>
      <p className="text-ash mb-10">Recent tasks, agent runs, and workspace events.</p>
      <ActivityHistory />
    </main>
  );
}
