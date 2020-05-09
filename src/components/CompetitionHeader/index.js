import React, { useState } from 'react';
import { fetchCompetitions } from '../../actions';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import styles from './index.module.css';

function CompetitionHeader(props) {
  const [ tab, setTab ] = useState(0);
  let { competitionId } = useParams();
  competitionId = +competitionId;
  const competition = props.competitions.find(c => c.id === competitionId);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.block}>
            <div className={styles.title}>{competition.title}</div>
            <div className={styles.brief}>{competition.briefDescription}</div>
          </div>
          <div className={styles.details}>2 месяца осталось • {competition.teams} команды</div>
        </div>
        <div className={styles.bottomMenu}>
          <div className={styles.buttonsWrapper}>
            {props.menuItems.map((item, i) =>
              <div key={i} className={styles.button.concat(tab === i ? ` ${styles.buttonSelected}` : '')} onClick={() => setTab(i)}>{item}</div>
            )}
          </div>
          <div className={styles.joinButton}>Участвовать</div>
        </div>
      </div>
      {props.render(tab)}
    </div>
  );
}

const mapStateToProps = (state) => ({
  competitions: state.competitions.list,
  isLoading: state.competitions.isLoading,
});

const mapDispatchToProps = dispatch => ({
  fetchCompetitions: () => dispatch(fetchCompetitions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionHeader);
