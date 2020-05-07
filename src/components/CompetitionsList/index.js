import React, {useEffect} from 'react';
import {fetchCompetitions} from '../../actions';
import { connect } from 'react-redux';
import styles from './index.module.css';
import ListItem from "../ListItem";

function CompetitionsList(props) {
  useEffect(() => {
    props.fetchCompetitions();
  }, []);
  const listItems = props.competitions.map(c => <ListItem key={c.id} competition={c}/>);
  return (
    <div className={styles.container}>
      <div className={styles.title}>Все соревнования</div>
      <div className={styles.list}>
        {listItems}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  competitions: state.competitions.list,
  isLoading: state.competitions.isLoading,
});

const mapDispatchToProps = dispatch => ({
  fetchCompetitions: () => dispatch(fetchCompetitions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionsList);
