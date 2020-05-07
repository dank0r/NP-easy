import React from 'react';
import styles from './index.module.css';
import CompetitionsList from '../CompetitionsList';

function MainPage(props) {
  return (
    <div className={styles.container}>
      <CompetitionsList />
    </div>
  );
}

export default MainPage;
