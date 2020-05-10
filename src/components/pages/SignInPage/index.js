import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import styles from './index.module.css';
import { signIn } from "../../../actions";

function SingInPage(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const me = props.users.find(u => u.isMe);
    if(me) {
      localStorage.setItem('token', me.token);
      props.history.push('/');
    }
  });

  function handleSignIn() {
    props.signIn({ username, password });
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.wrapper}>
          <div className={styles.logo}>np-easy</div>
          <div className={styles.content}>
            <div className={styles.title}>Войти</div>
            <div className={styles.inputWrapper}>
              <div className={styles.textField}>
                <TextField value={username} onKeyPress={e => e.key === 'Enter' ? handleSignIn() : null} onChange={e => setUsername(e.target.value)} fullWidth label="Username" variant="outlined" />
              </div>
              <div className={styles.textField}>
                <TextField value={password}  onKeyPress={e => e.key === 'Enter' ? handleSignIn() : null} onChange={e => setPassword(e.target.value)} fullWidth label="Password" variant="outlined" type="password"/>
              </div>
            </div>
            <div className={styles.bottomWrapper}>
              <div className={styles.alternative}>Нет аккаунта? <div onClick={() => props.history.push('/signup')} className={styles.link}>Создать.</div></div>
              <div onClick={handleSignIn} className={styles.button}>Войти</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  users: state.users.list,
});

const mapDispatchToProps = dispatch => ({
  signIn: (params) => dispatch(signIn(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SingInPage));
