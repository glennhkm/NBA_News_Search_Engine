import { Suspense } from "react";
import SearchClient from "./searchClient";
import { Loading } from "@/components/loading/loading";

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen justify-center items-center flex">
        <Loading/>
        <p className="text-red-800/60 animate-blink">Retrieving...</p>
      </div>}>
      <SearchClient />
    </Suspense>
  );
}