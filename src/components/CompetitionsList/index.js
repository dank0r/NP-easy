import React, {useEffect} from 'react';
import {fetchCompetitions, fetchCompetitionsOfUser} from '../../actions';
import { connect } from 'react-redux';
import styles from './index.module.css';
import ListItem from "../ListItem";

function CompetitionsList(props) {
  useEffect(() => {
    if(props.me) {
      const userId = props.me.id;
      const token = props.me.token;
      props.fetchCompetitionsOfUser({ userId, token });
    }
    props.fetchCompetitions();
  }, [props.me]);
  const comps = props.competitions.map(c => <ListItem key={c.id} competition={c}/>);
  let myComps = props.myCompetitions.map(id => props.competitions.find(c => c.id === id)).map(c => <ListItem key={c.id} competition={c}/>);
  return (
    <div className={props.dark ? styles.container.concat(` ${styles.dark}`) : styles.container}>
      {myComps.length && props.me ?
        (<><div className={styles.title}>Ваши соревнования</div>
      <div className={styles.shortList}>
        {myComps}
      </div></>) : null}
      <div className={styles.title}>Все соревнования</div>
      <div className={props.dark ? styles.list.concat(` ${styles.dark}`) : styles.list}>
        {comps}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  me: state.users.list.find(u => u.isMe),
  competitions: state.competitions.list,
  myCompetitions: state.competitions.myCompetitions,
  isLoading: state.competitions.isLoading,
  dark: state.dark,
});

const mapDispatchToProps = dispatch => ({
  fetchCompetitions: () => dispatch(fetchCompetitions()),
  fetchCompetitionsOfUser: (params) => dispatch(fetchCompetitionsOfUser(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionsList);
