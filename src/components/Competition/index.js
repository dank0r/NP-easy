import React, { useEffect } from 'react';
import { fetchCompetitions } from '../../actions';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import styles from './index.module.css';
import CompetitionHeader from "../CompetitionHeader";
import SubmitSolution from '../SubmitSolution';

const menuItems = ['Обзор', 'Лидерборд'];

function CompetitionContent(props) {
  const overview = !props.competition || ReactHtmlParser(props.competition.description);
  const tabsContent = [overview, '', <SubmitSolution {...props} />];

  return (
      <div className={styles.contentBox}>
        <div className={styles.title}>{props.tab === menuItems.length ? 'Загрузить решение' : menuItems[props.tab]}</div>
        <div className={styles.description}>{tabsContent[props.tab]}</div>
      </div>
  );
}

function Competition(props) {
  useEffect(() => {
    props.fetchCompetitions();
  }, []);
  let { competitionId } = useParams();
  competitionId = +competitionId;
  const competition = props.competitions.find(c => c.id === competitionId);
  return (
    <CompetitionHeader {...props} menuItems={menuItems} render={(tab) => <CompetitionContent competition={competition} tab={tab} />}/>
  );
}

const mapStateToProps = (state) => ({
  competitions: state.competitions.list,
  isLoading: state.competitions.isLoading,
});

const mapDispatchToProps = dispatch => ({
  fetchCompetitions: () => dispatch(fetchCompetitions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Competition);
