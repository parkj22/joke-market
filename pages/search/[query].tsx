import LargeSearchBar from "../../components/search/LargeSearchBar";
import Layout from "../../components/Layout";
import SearchByBar from "../../components/search/SearchByBar";
import SearchContent from "../../components/search/SearchContent";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const [searchBy, setSearchBy] = useState<string>("all");
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { query } = router.query;
      setCurrentQuery(query as string ?? "");
    }
  }, [router]);

  return (
    <div className="flex-grow min-h-screen pt-6 overflow-y-auto scrollbar-hide pb-6">
      <div className="mx-auto max-w-xs sm:max-w-md md:max-w-3xl space-y-2">
        <LargeSearchBar currentQuery={currentQuery} />
        <SearchByBar searchBy={searchBy} setSearchBy={setSearchBy}/>
        <SearchContent currentQuery={currentQuery} searchBy={searchBy}/>
      </div>
    </div>
  );
}

SearchPage.getLayout = function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
};
