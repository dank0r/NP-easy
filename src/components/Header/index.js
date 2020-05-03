import React from 'react';
import styles from './index.module.css';
import Header from '../Header';
import Competitions from '../Competitions';

function MainPage(props) {
  return (
    <div className={styles.container}>
      <Header className={styles} />
      <Competitions />
    </div>
  );
}

export default MainPage;
