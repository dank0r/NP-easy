import React, {useState, useEffect} from 'react';
import styles from './index.module.css';

function SearchInput(props) {
  const [value, setValue] = useState('');
  const [bgcolor, setBgcolor] = useState(styles.gray);
  const input = React.createRef();
    return (
      <div className={`${styles.container} ${bgcolor}`}
           onClick={()=> input.current.focus()}
      >
        <div className={styles.icon} />
        <input placeholder={props.placeholder} className={styles.input} type="text"
               spellCheck={false}
               value={value}
               ref={input}
               onChange={e => setValue(e.target.value)}
               onFocus={() => setBgcolor(styles.white)}
               onBlur={() => setBgcolor(styles.gray)}
        />
      </div>
      );
}


export default SearchInput;