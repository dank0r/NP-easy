import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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
      <div className={styles.firstCol}>{i + 1}</div>
      <div className={styles.secondCol.concat(` ${styles.team}`)}>{author ? author.username : ''}</div>
      <div className={styles.thirdCol}>{s.result || 'no result yet'}</div>
      <div className={styles.fourthCol}>{!!author && props.submissions.filter(s => s.userId === author.id).length}</div>
      <div className={styles.fifthCol}>{s.submissionDateTime}</div>
    </div>
  );
}

function Leaderboard(props) {
  useEffect(() => {
    const competitionId = props.competition.id;
    props.fetchSubmissions({competitionId});
  }, []);

  const submissions = props.submissions.filter(s => s.competitionId === props.competition.id);
  let leaderboardItems = [...submissions].sort((s1, s2) => +s1.submissionDateTime - +s2.submissionDateTime);
  if(props.private && props.me) {
    leaderboardItems = leaderboardItems.filter(s => s.userId === props.me.id);
  } else {
    leaderboardItems = leaderboardItems
      .reduce((acc, s) => acc.some(ss => ss.userId === s.userId) ? acc : acc.concat(s), [])
      .sort((s1, s2) => +s1.result - +s2.result);
  }
  leaderboardItems = leaderboardItems.map((s, i) => <LeaderboardItem key={s.id || i} {...props} s={s} i={i} submissions={submissions} />);
  console.log(leaderboardItems);
  return (
    <div className={styles.container}>
      <div className={styles.line}>
        <div className={styles.firstCol}>#</div>
        <div className={styles.secondCol}>Username</div>
        <div className={styles.thirdCol}>Результат</div>
        <div className={styles.fourthCol}>Посылки</div>
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
