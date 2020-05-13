import React, { useEffect } from 'react';
import {fetchCompetitions, fetchCompetitionsOfUser} from '../../actions';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import styles from './index.module.css';
import CompetitionHeader from "../CompetitionHeader";
import SubmitSolution from '../SubmitSolution';
import Leaderboard from '../Leaderboard';



function CompetitionContent(props) {
  const overview = !!props.competition && ReactHtmlParser(props.competition.description);
  const tabsContent = [
    <div className={styles.description}>{overview}</div>,
    <Leaderboard {...props} />,
    <Leaderboard {...props} private />,
    <SubmitSolution {...props} />];

  return (
      <div className={styles.contentBox}>
        <div className={styles.title}>{props.tab === props.menuItems.length ? 'Загрузить решение' : props.menuItems[props.tab]}</div>
        <div className={styles.content}>{tabsContent[props.tab]}</div>
      </div>
  );
}

function Competition(props) {
  useEffect(() => {
    if(props.me) {
      const userId = props.me.id;
      const token = props.me.token;
      props.fetchCompetitionsOfUser({ userId, token });
    }
    props.fetchCompetitions();
  }, [props.me]);
  let { competitionId } = useParams();
  competitionId = +competitionId;
  const competition = props.competitions.find(c => c.id === competitionId);

  let menuItems = ['Обзор', 'Лидерборд', 'Мои решения'];
  return (
    <CompetitionHeader {...props} menuItems={menuItems} render={(tab) => <CompetitionContent  menuItems={menuItems} competition={competition} tab={tab} />}/>
  );
}

const mapStateToProps = (state) => ({
  me: state.users.list.find(u => u.isMe),
  competitions: state.competitions.list,
  isLoading: state.competitions.isLoading,
});

const mapDispatchToProps = dispatch => ({
  fetchCompetitions: () => dispatch(fetchCompetitions()),
  fetchCompetitionsOfUser: (params) => dispatch(fetchCompetitionsOfUser(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Competition);
