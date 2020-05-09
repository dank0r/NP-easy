import React from 'react';
import styles from './index.module.css';
import Header from '../Header';

function BasicWrapper(props) {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.wrapper}>
        {props.children}
      </div>
    </div>
  );
}

export default BasicWrapper;
