import FiltersBar from "../components/filtersBar/filtersBar";
import { useDataExplorer } from "./dataExplorer.func";
import styles from "./dataExplorer.module.css";


export default function DataExplorer() {
  const { query, facetsQuery, fields } = useDataExplorer();
  const { data, isLoading, isFetching, error } = query;

  return (
    <main className={styles.page}>
      <FiltersBar
        fields={fields}
        resetPageKeys={["q","category","taxCategory","inStock","priceMin","priceMax","pageSize","sortBy","sortDir"]}
        replaceKeys={["q","priceMin","priceMax"]}
      />
      <section className={styles.content}>
        {error ? (
          <p style={{ color: 'var(--color-danger)' }}>Failed to load</p>
        ) : isLoading && !data ? (
          <div style={{ padding: '1rem 0' }}>Loading…</div>
        ) : (
          <>
            <h1>
              Data Explorer {isFetching ? <small className={styles.updating}>(updating...)</small> : null}
            </h1>
            <p>Total items: {data?.total ?? '—'}</p>
            <pre className={styles.pre}>
              {JSON.stringify(facetsQuery.data, null, 2)}
            </pre>
          </>
        )}
      </section>
    </main>
  )
}


