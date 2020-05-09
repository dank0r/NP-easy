import React, { useState } from 'react';
import { fetchCompetitions } from '../../actions';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import styles from './index.module.css';
import CompetitionHeader from "../CompetitionHeader";

const menuItems = ['Обзор', 'Лидерборд'];

function CompetitionContent(props) {
  return (
      <div className={styles.contentBox}>
        <div className={styles.title}>{menuItems[props.tab]}</div>
        <div className={styles.description}>{ReactHtmlParser(props.competition.description)}</div>
      </div>
  );
}

function Competition(props) {
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
