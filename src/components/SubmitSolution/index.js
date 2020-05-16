import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-icons-kit';
import { upload } from 'react-icons-kit/fa/upload';
import styles from './index.module.css';
import {submitSolution, popupShow} from '../../actions';
import AlertPopUp from '../AlertPopUp';

function SubmitSolution(props) {
  const [ file, setFile ] = useState(null);

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  function handleSend() {

    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
    if (file instanceof Blob) {
      console.log(file.name);
      toBase64(file).then(data => {
        const filename = file.name;
        const userId = props.me.id;
        const token = props.me.token;
        const competitionId = props.competition.id;
        props.submitSolution({ data, filename, userId, token, competitionId })
          .then(() => props.popupShow('Oh yeah', 'Ваше решение отправлено успешно :)'));
        props.setTab(2);
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <div className={styles.title}>Формат файла</div>
          <div className={styles.text}>
            Ваше решение должно состоять из одного файла в формате *.cpp или *.py.
          </div>
        </div>
        <div className={styles.inputFileWrapper}>
          <input type="file" id="file" className={styles.inputFile} onChange={handleChange} />
          <label htmlFor="file">{file ? file.name : <Icon size={64} icon={upload} />}</label>
        </div>
    </div>
      <div className={styles.buttonWrapper}>
        <div onClick={handleSend} className={styles.button}>Отправить</div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  me: state.users.list.find(u => u.isMe),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  submitSolution,
  popupShow,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SubmitSolution));
