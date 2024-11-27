"use client";

import { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormSearch } from "@/components/formSearch/formSearch";
import Image from "next/image";
import { Loading } from "@/components/loading/loading";
import { NoResultFound } from "@/components/noResultFound/noResultFound";
import { TextMarquee } from "@/components/marquee/textMarquee";
// import { useIsBrowser } from "@/hooks/useIsBrowser";

interface Article {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  link: string;
  wp_image: string;
  date: string;
}

interface SearchResult {
  article: Article;
  similarity_score: number;
}

interface AlgorithmResults {
  results: SearchResult[];
  computation_time: number;
}

const Search = () => {
  const searchParams = useSearchParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const [page, setPage] = useState<number>(Number(searchParams.get("page")) || 1);
  const [cosineResults, setCosineResults] = useState<AlgorithmResults | null>(null);
  const [jaccardResults, setJaccardResults] = useState<AlgorithmResults | null>(null);
  const [loading, setLoading] = useState(false);  
  // const isBrowser = useIsBrowser()
  const [sessionId, setSessionId] = useState("");
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [skip, setSkip] = useState(page ? (page - 1) * 11 : 0);
  const router = useRouter();
  const firstRenderRef = useRef(true);

  useEffect(() => {
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsSocketReady(true);
    });

    newSocket.on("cosine_results", (data) => {
      if (data.sid === newSessionId) {
        setCosineResults({
          results: data.results,
          computation_time: data.computation_time      
        });
      }
    });

    newSocket.on("jaccard_results", (data) => {
      if (data.sid === newSessionId) {
        setJaccardResults({
          results: data.results,
          computation_time: data.computation_time      
        });        
        setTotalPages(data.results.length);
      }
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   if (isBrowser && firstRenderRef.current && query && isSocketReady) {
  //     const formElement = document.querySelector("form");
  //     if (formElement) {
  //       const event = new Event("submit", { bubbles: true, cancelable: true });
  //       formElement.dispatchEvent(event);
  //     }
  //     firstRenderRef.current = false;
  //   }
  // }, [isBrowser, query, isSocketReady]);

  useEffect(() => {
    // Pastikan kode ini HANYA berjalan di browser
    if (typeof window !== 'undefined' && firstRenderRef.current && query && isSocketReady) {
      // Delay untuk memastikan DOM sudah siap
      const timer = setTimeout(() => {
        const formElement = document.querySelector("form");
        if (formElement) {
          const event = new Event("submit", { bubbles: true, cancelable: true });
          formElement.dispatchEvent(event);
        }
        firstRenderRef.current = false;
      }, 1000);

      // Bersihkan timer untuk mencegah memory leak
      return () => clearTimeout(timer);
    }
  }, [query, isSocketReady]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }    

    const isSameQuery = searchParams.get("q") === query;
    router.replace(`/search?q=${query}&page=${isSameQuery ? page : 1}`);
    setCosineResults(null);
    setJaccardResults(null);
    setLoading(true);
    if (!isSameQuery) {
      setPage(1);
      setSkip(0);
    }

    socket?.emit("search_request", {
      query,
      top_k: 50,
      sid: sessionId,
    });

    setLoading(false);
  };

  const handlePagination = (index: number) => {
    setSkip(((index) * 11) - 11)
    setPage(index);
    router.replace(`/search?q=${query}&page=${index}`);
  }

  const renderResults = (results: AlgorithmResults) => (
    <div className="grid grid-cols-2 gap-4 z-10">
      {results.results.map((result, index) => (
        <div
          key={result.article._id}
          className={`px-4 pt-24 pb-4 rounded-2xl flex flex-col justify-end relative border-[1px] border-white/40 shadow-lg shadow-black/60 hover:scale-[1.03] duration-200 ${
            (index + 1) % 3 == 0 ? "col-span-2" : "col-span-1"
          }`}
        >
          <div className="bg-gradient-to-t from-black/95 via-black/75 via-60% to-black/20 w-full h-full left-0 top-0 absolute rounded-2xl -z-[2]"></div>
          <Image
            src={`${result.article.wp_image}` || "/images/curry.jpg"}
            alt={result.article.title + "wp image"}
            fill
            sizes="30%"
            className="rounded-2xl h-full w-full object-cover -z-[5]"
          />
          <h3 className="font-bold text-lg mb-2">{result.article.title}</h3>
          <p className="text-gray-400 text-xs mb-2">{result.article.date}</p>
          <p className="text-gray-400 text-sm text line-clamp-2">
            {result.article.subtitle}...
          </p>
          <div className="mt-2 flex justify-between items-center">
            <a
              href={result.article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Read More
            </a>
            <span className="text-sm text-gray-300">
              Similarity: {(result.similarity_score * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      <TextMarquee position="top"/>
      <div className="w-full bg-[#151515] pt-12 z-40 fixed top-0 left-0 border-b border-b-white/30">
        <div className="flex flex-col gap-4 w-1/2 pl-32">
          <h1 className="font-extrabold text-[2.5rem]">
            NBA News Search Engine
          </h1>
          <FormSearch
            inputClassName="py-3 text-black"
            formClassName="bg-white/50 w-full"
            setSearchValue={setQuery}
            searchValue={query}
            searchHandler={handleSearch}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-8 px-8">
          <div className="flex justify-between bg-yellow-600/70 h-full py-3 rounded-t-2xl px-4 items-center">          
            <h2 className="text-lg font-bold text-white">
              Cosine Similarity Results
            </h2>
            {cosineResults && (
              <p className="text-sm">
                Computation Time:{" "}
                {(cosineResults.computation_time * 1000).toFixed(2)} ms
              </p>
            )}
          </div>
          <div className="flex justify-between bg-blue-900/70 h-full py-3 rounded-t-2xl px-4 items-center">       
            <h2 className="text-lg font-bold text-white">
              Jaccard Similarity Results
            </h2>
            {jaccardResults && (
              <p className="text-sm">
                Computation Time:{" "}
                {(jaccardResults.computation_time * 1000).toFixed(2)} ms
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={`grid md:grid-cols-2 gap-8 mt-[18.2rem] pb-8 px-8 relative ${(!loading && totalPages !== 0) && 'border-b-[1.5px] border-b-white/30'}`}>
        <div className={`${loading || jaccardResults?.results.length === 0 ? 'fixed h-screen top-0' : 'absolute -top-[16.4rem] bottom-0'} left-1/2 -translate-x-1/2 w-[1.5px] bg-white/30`}></div>
        {!loading && (
          <>
            {(cosineResults) && cosineResults.results.length > 0  ? renderResults({ 
                  results: cosineResults.results.slice(skip, skip + 11), 
                  computation_time: cosineResults.computation_time 
                })
                : <NoResultFound/>
            }
            {(jaccardResults) && jaccardResults.results.length > 0 ? renderResults({ 
                  results: jaccardResults.results.slice(skip, skip + 11), 
                  computation_time: jaccardResults.computation_time 
                })
                : <NoResultFound/>
            }
          </>
        )}
        {loading && (
          <>
            <Loading/>
            <Loading/>
          </>
        )}
      </div>
      <div className="w-full flex gap-2 my-6 justify-center">
        {Array.from({ length: Math.ceil(totalPages/11) }).map((_, index) => (
          <button className={`${index + 1 === page ? 'bg-red-800/60 ' : 'bg-[#151515]'} rounded-full text-xs h-9 w-9 shadow-md shadow-black/90 hover:bg-black border-[1px] border-white/20`} key={index} onClick={() => handlePagination(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};


const ResultPage = () => {
  return (
    <Suspense>
      <Search/>
    </Suspense>
  );  
}

export default ResultPage;
