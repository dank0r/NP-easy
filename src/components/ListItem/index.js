import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from "react-router-dom";
import styles from './index.module.css';


function ListItem(props) {
  const {id, title, briefDescription, teams} = props.competition;

  return (
    <div className={props.dark ? styles.container.concat(` ${styles.dark}`) : styles.container} onClick={() => props.history.push(`/competition/${id}`)}>
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

const mapStateToProps = state => ({
  dark: state.dark,
});

export default connect(mapStateToProps)(withRouter(ListItem));
