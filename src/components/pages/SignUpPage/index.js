import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextField from '@material-ui/core/TextField';
import styles from './index.module.css';
import { signUp, popupShow } from "../../../actions";

function SignUpPage(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const me = props.users.find(u => u.isMe);
    if(me) {
      localStorage.setItem('token', me.token);
      props.history.push('/');
    }
  });

  function handleSignUp() {
    props.signUp({ username, password, email }).catch(action => props.popupShow('Oops', action.error.response.data.error));
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.wrapper}>
          <div className={styles.logo}>np-easy</div>
          <div className={styles.content}>
            <div className={styles.title}>Зарегистрироваться</div>
            <div className={styles.inputWrapper}>
              <div className={styles.textField}><TextField value={username} onKeyPress={e => e.key === 'Enter' ? handleSignUp() : null} onChange={e => setUsername(e.target.value)} fullWidth label="Username" variant="outlined" /></div>
              <div className={styles.textField}><TextField value={email} onKeyPress={e => e.key === 'Enter' ? handleSignUp() : null} onChange={e => setEmail(e.target.value)} fullWidth label="Email" variant="outlined" /></div>
              <div className={styles.textField}><TextField value={password} onKeyPress={e => e.key === 'Enter' ? handleSignUp() : null} onChange={e => setPassword(e.target.value)} fullWidth label="Password" variant="outlined" type="password"/></div>
            </div>
            <div className={styles.bottomWrapper}>
              <div className={styles.alternative}>Уже есть аккаунт? <div onClick={() => props.history.push('/signin')} className={styles.link}>Войти.</div></div>
              <div onClick={handleSignUp} className={styles.button}>Зарегистрироваться</div>
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

const mapDispatchToProps = dispatch => bindActionCreators({
  signUp,
  popupShow,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUpPage));
