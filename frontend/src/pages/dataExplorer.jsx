import { useMemo } from "react";
import FiltersBar from "../components/filtersBar/filtersBar";
import VirtualTable from "../components/virtualTable/virtualTable";
import SavedViewsManager from "../features/savedViews/SavedViewsManager";
import { useDataExplorer } from "./dataExplorer.func";
import styles from "./dataExplorer.module.css";

export default function DataExplorer() {
  const { query, facetsQuery, fields, loadMore } = useDataExplorer();
  const { data, isLoading, isFetching, error } = query;

  const columns = useMemo(() => [
    { 
      key: 'name', 
      label: 'Name', 
      width: '30%',
      render: (value) => <strong>{value}</strong>
    },
    { 
      key: 'category', 
      label: 'Category', 
      width: '15%',
      render: (value) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
    },
    { 
      key: 'price', 
      label: 'Price', 
      width: '12%',
      render: (value) => `$${Number(value).toFixed(2)}`
    },
    { 
      key: 'sold', 
      label: 'Sold', 
      width: '12%',
      render: (value) => Number(value).toLocaleString()
    },
    { 
      key: 'inStock', 
      label: 'In Stock', 
      width: '15%',
      render: (value) => (
        <span style={{ 
          color: value ? 'var(--color-success)' : 'var(--color-danger)' 
        }}>
          {value ? '✓ Yes' : '✗ No'}
        </span>
      )
    },
    { 
      key: 'taxCategory', 
      label: 'Tax', 
      width: '16%',
      render: (value) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
    }
  ], []);

  return (
    <main className={styles.page}>
      <FiltersBar
        fields={fields}
        resetPageKeys={["q","category","taxCategory","inStock","priceMin","priceMax","pageSize","sortBy","sortDir"]}
        replaceKeys={["q","priceMin","priceMax"]}
      />
      <section className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>
              Data Explorer {isFetching ? <small className={styles.updating}>(updating...)</small> : null}
            </h1>
            <p className={styles.stats}>
              Total items: <strong>{data?.total ?? '—'}</strong>
            </p>
          </div>
          <SavedViewsManager />
        </div>
        
        {error ? (
          <p style={{ color: 'var(--color-danger)' }}>Error: {error.message}</p>
        ) : (
          <VirtualTable 
            data={data?.items || []}
            columns={columns}
            rowHeight={48}
            isLoading={isLoading && !data}
            isFetchingMore={isFetching && data}
            hasMore={data ? (data.items?.length < data.total) : false}
            onLoadMore={loadMore}
            onRowClick={(item) => console.log('Clicked:', item)}
          />
        )}
      </section>
    </main>
  )
}


