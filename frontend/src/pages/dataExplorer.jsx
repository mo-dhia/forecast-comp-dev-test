import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useItems, useGlobalFacets } from "../utils/api/services/useItems";

const queryClient = new QueryClient();

function DemoContent() {
  const { data, isLoading, error } = useItems({ page: 1, pageSize: 10 });
  const { data: globalFacets } = useGlobalFacets();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{color: 'var(--color-danger)'}}>Failed to load</p>;

  return (
    <>
      <h1>Data Explorer</h1>
      <p>Total items: {data?.total}</p>
      <pre style={{background:'rgba(255,255,255,0.03)', padding:'1rem', borderRadius:'var(--radius-md)'}}>
        {JSON.stringify(globalFacets, null, 2)}
      </pre>
    </>
  );
}

export default function DataExplorer() {
  return (
    <main style={{maxWidth: 'var(--container-max)', margin: '0 auto', padding: '2rem'}}>
      <QueryClientProvider client={queryClient}>
        <DemoContent />
      </QueryClientProvider>
    </main>
  )
}


