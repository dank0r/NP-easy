import React from 'react';
import { withRouter } from 'react-router-dom';
import styles from './index.module.css';
import SearchInput from '../SearchInput';

function Header(props) {
  return (
    <div className={styles.container}>
      <div className={styles.logo} onClick={() => props.history.push('/')}>
        np-easy
      </div>
      <SearchInput placeholder={'Поиск'} className={styles.search} />
      <div className={styles.avatar} />
    </div>
  );
}

export default withRouter(Header);
