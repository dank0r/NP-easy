import React from 'react';
import styles from './index.module.css';

function ListItem(props) {
  const {title, briefDescription, teams} = props.competition;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.picture} />
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{briefDescription}</div>
          <div className={styles.details}>2 месяца осталось • {teams} команды</div>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
