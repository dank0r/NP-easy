import React from 'react';
import styles from './index.module.css';

function ListItem(props) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.picture} />
        <div className={styles.info}>
          <div className={styles.title}>Travelling Salesman Person</div>
          <div className={styles.description}>Определить кратчайший путь, проходящий через все вершины графа</div>
          <div className={styles.details}>2 месяца осталось • 3 команды</div>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
