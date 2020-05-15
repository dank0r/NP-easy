import React from 'react';
import {connect} from 'react-redux';
import styles from './index.module.css';
import Header from '../Header';

function BasicWrapper(props) {
  return (
    <div className={styles.container}>
      <Header />
      <div className={props.dark ? styles.wrapper.concat(` ${styles.dark}`) : styles.wrapper}>
        {props.children}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  dark: state.dark,
});

export default connect(mapStateToProps)(BasicWrapper);
