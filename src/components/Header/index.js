import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signOut } from "../../actions";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './index.module.css';
import SearchInput from '../SearchInput';

function Profile(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleLogoutClick() {
    localStorage.removeItem('token');
    const { username, token } = props.me;
    props.signOut({username, token});
    setAnchorEl(null);
  }

  function handleProfileClick() {
    props.history.push('/profile');
    setAnchorEl(null);
  }

  return (
    <>
      <div className={styles.avatar} onClick={handleClick} />
      <Menu
        className={styles.menu}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <div className={styles.menuInfoWrapper}>
          <div>Вы вошли как</div>
          <div>{props.me.username}</div>
        </div>
        <MenuItem onClick={handleProfileClick} className={styles.menuItem}>Профиль</MenuItem>
        <MenuItem onClick={handleLogoutClick} className={styles.menuItem}>Выйти</MenuItem>
      </Menu>
    </>
  );
}

function SignInUpInvitation(props) {
  return (
    <>
      <div onClick={() => props.history.push('/signin')} className={styles.signIn}>Войти</div>
      <div onClick={() => props.history.push('/signup')} className={styles.signUp}>Регистрация</div>
    </>
  );
}

function Header(props) {
  const [me, setMe] = useState(null);

  useEffect(() => {
    console.log(123);
    const me = props.users.find(u => u.isMe);
    if(me) {
      setMe(me);
    } else {
      setMe(null);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.logo} onClick={() => props.history.push('/')}>
        np-easy
      </div>
      <SearchInput placeholder={'Поиск'} className={styles.search} />
      {me ? <Profile {...props} me={me} /> : <SignInUpInvitation {...props} />}
    </div>
  );
}

const mapStateToProps = state => ({
  users: state.users.list,
});

const mapDispatchToProps = dispatch => ({
  signOut: (props) => dispatch(signOut(props)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
