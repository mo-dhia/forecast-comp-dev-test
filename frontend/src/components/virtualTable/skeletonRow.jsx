import styles from './skeletonRow.module.css';

export default function SkeletonRow({ columns = [] }) {
  return (
    <div className={styles.row}>
      {columns.map((col, idx) => (
        <div 
          key={idx}
          className={styles.cell}
          style={{ 
            width: col.width || 'auto', 
            flex: col.width ? 'none' : (col.flex || 1),
            flexShrink: 0
          }}
        >
          <div className={styles.skeleton}></div>
        </div>
      ))}
    </div>
  );
}
