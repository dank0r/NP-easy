import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import localization from 'moment/locale/ru'
import { fetchSubmissions, fetchUser } from "../../actions";
import styles from './index.module.css';

function LeaderboardItem(props) {
  const {s, i} = props;
  const author = props.users.find(u => u.id === s.userId);
  useEffect(() => {
    const userId = s.userId;
    props.fetchUser({userId});
  }, []);
  return (
    <div className={styles.line} key={s.id}>
      <div className={styles.firstCol}>{props.private ? props.arr.length - i : i + 1}</div>
      <div className={styles.secondCol.concat(` ${styles.team}`)}>{author ? author.username : ''}</div>
      <div className={styles.thirdCol}>{s.result || '-'}</div>
      <div className={styles.fourthCol}>{props.private ? s.status : (!!author && props.submissions.filter(s => s.userId === author.id).length)}</div>
      <div className={styles.fifthCol}>{moment(s.submissionDateTime).locale('ru', localization).fromNow()}</div>
    </div>
  );
}

function Leaderboard(props) {
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if(props.competition) {
      const competitionId = props.competition.id;
      props.fetchSubmissions({competitionId});
      if(!intervalId) {
        const interval = setInterval(() => {
          props.fetchSubmissions({competitionId});
        }, 5000);
        setIntervalId(interval);
      } else if(props.submissions && !props.submissions.some(s => s.status === 'testing')) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, []);
  const submissions = props.submissions.filter(s => s.competitionId === props.competition.id);
  let leaderboardItems = [...submissions].sort((s1, s2) => s1.submissionDateTime < s2.submissionDateTime ? 1 : -1);
  if(props.private && props.me) {
    leaderboardItems = leaderboardItems.filter(s => s.userId === props.me.id);
  } else {
    leaderboardItems = leaderboardItems
      .reduce((acc, s) => acc.some(ss => ss.userId === s.userId) ? acc : acc.concat(s), [])
      .sort((s1, s2) => +s1.result - +s2.result);
  }
  leaderboardItems = leaderboardItems.map((s, i, arr) => <LeaderboardItem key={s.id || i} {...props} s={s} i={i} submissions={submissions} arr={arr} />);
  return (
    <div className={styles.container}>
      <div className={styles.line}>
        <div className={styles.firstCol}>#</div>
        <div className={styles.secondCol}>Username</div>
        <div className={styles.thirdCol}>Результат</div>
        <div className={styles.fourthCol}>{props.private ? 'Статус' : 'Посылки'}</div>
        <div className={styles.fifthCol}>Последняя</div>
      </div>
      {leaderboardItems}
    </div>
  );
}

const mapStateToProps = state => ({
  users: state.users.list,
  me: state.users.list.find(u => u.isMe),
  submissions: state.submissions.list
});

const mapDispatchToProps = dispatch => ({
  fetchSubmissions: (params) => dispatch(fetchSubmissions(params)),
  fetchUser: (params) => dispatch(fetchUser(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Leaderboard));
