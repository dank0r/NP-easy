import React from 'react';
import styles from './index.module.css';
import SearchInput from '../SearchInput';

function Header(props) {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        np-easy
      </div>
      <SearchInput placeholder={'Поиск'} className={styles.search} />
      <div className={styles.avatar} />
    </div>
  );
}

export default Header;
