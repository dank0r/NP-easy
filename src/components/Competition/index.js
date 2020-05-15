import React, { useEffect } from 'react';
import {fetchCompetitions, fetchCompetitionsOfUser} from '../../actions';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import styles from './index.module.css';
import CompetitionHeader from "../CompetitionHeader";
import SubmitSolution from '../SubmitSolution';
import Leaderboard from '../Leaderboard';

const temp = '<h2>Постановка задачи</h2>' +
  'Задача коммивояжёра (или TSP от англ. Travelling salesman problem) — одна из самых известных задач комбинаторной оптимизации, заключающаяся в поиске кратчайшего маршрута, проходящего через указанные города по одному разу с последующим возвратом в исходный город.' +
  '<h2>Входные данные</h2>' +
  '<h3>stdin или input.txt:</h3>' +
  '<div>1 строка - число n вершин в графе\n</div>' +
  '<div>Следующие n строк - строки матрицы смежности</div>' +
  '<h2>Выходные данные</h2>' +
  '<h3>stdout или output.txt:</h3>' +
  'Последовательность n чисел (где каждое число от 0 до n-1 это индекс вершины), разделенных пробелом и образующих гамильтонов цикл.' +
  '<h2>Оценка решений</h2>' +
  'Основной метрикой решения считается длина цикла, выданного вашей программой. Чем меньше - тем лучше.';

function CompetitionContent(props) {
  const overview = ReactHtmlParser(temp);
  //const overview = !!props.competition && ReactHtmlParser(props.competition.description);
  const tabsContent = [
    <div className={styles.description}>{overview}</div>,
    <Leaderboard {...props} />,
    <Leaderboard {...props} private />,
    <SubmitSolution {...props} />];

  return (
      <div className={props.dark ? styles.contentBox.concat(` ${styles.dark}`) : styles.contentBox}>
        <div className={styles.title}>{props.tab === props.menuItems.length ? 'Загрузить решение' : props.menuItems[props.tab]}</div>
        <div className={props.dark ? styles.content.concat(` ${styles.dark}`) : styles.content}>{tabsContent[props.tab]}</div>
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
    <CompetitionHeader {...props} menuItems={menuItems} render={(tab) => <CompetitionContent {...props}  menuItems={menuItems} competition={competition} tab={tab} />}/>
  );
}

const mapStateToProps = (state) => ({
  me: state.users.list.find(u => u.isMe),
  competitions: state.competitions.list,
  isLoading: state.competitions.isLoading,
  dark: state.dark,
});

const mapDispatchToProps = dispatch => ({
  fetchCompetitions: () => dispatch(fetchCompetitions()),
  fetchCompetitionsOfUser: (params) => dispatch(fetchCompetitionsOfUser(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Competition);
