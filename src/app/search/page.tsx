import { Suspense } from "react";
import SearchClient from "./searchClient";

export default function ResultPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchClient />
    </Suspense>
  );
}