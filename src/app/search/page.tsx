import { Suspense } from "react";
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled
const SearchClient = dynamic(
  () => import('./searchClient'),
  { 
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export default function ResultPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchClient />
    </Suspense>
  );
}