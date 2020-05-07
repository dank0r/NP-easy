import React from 'react';
import styles from './index.module.css';
import ListItem from "../ListItem";

function CompetitionsList(props) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Все соревнования</div>
      <div className={styles.list}>
        <ListItem />
      </div>
    </div>
  );
}

export default CompetitionsList;
