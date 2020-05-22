import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import styles from './index.module.css';


function ListItem(props) {
  const {id, title, briefDescription, teams, deadline} = props.competition;

  return (
    <div className={props.dark ? styles.container.concat(` ${styles.dark}`) : styles.container} onClick={() => props.history.push(`/competition/${id}`)}>
      <div className={styles.content}>
        <div className={styles.picture} />
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{briefDescription}</div>
          <div className={styles.details}>{moment(deadline).fromNow(true)} остался • {teams} команды</div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  dark: state.dark,
});

export default connect(mapStateToProps)(withRouter(ListItem));
