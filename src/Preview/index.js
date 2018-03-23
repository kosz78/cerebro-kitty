import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Loading, KeyboardNav, KeyboardNavItem } from 'cerebro-ui'
import styles from './styles.css'
import fs from 'fs'

class Preview extends Component {
  
  getDirList(root, dir, entries) {
    let items = fs.readdirSync(root + dir);
    for (const item of items) {
      try {
        let child = fs.readdirSync(root + dir + '\\' + item);
        // use readdirSync because NodeJS has issue this fs.stat for OneDrive folders 
        // https://github.com/nodejs/node/issues/12737
        if (child && child.length > 0) {
          if(dir === '') {
            this.getDirList(root, item, entries);
          } else {
            this.getDirList(root, dir + '\\' + item, entries);
          }
        } else {
          entries.push({folder: dir, session: session});
        }
      } catch(error) {
        entries.push({folder: dir, session: item});
      }
    }
  }

  getSessions(kittyPath) {
    var entries = [];
    this.getDirList(kittyPath + '\\Sessions\\', '', entries);
    return entries;
  }

  render() {
    const term = this.props.term;
    const kittyPath = this.props.kittyPath;
    const callback = this.props.callback;
    if (!kittyPath) {
      return (<h1>Kitty home directory not set in plugin settings</h1>);
    }
    var sessions = this.getSessions(kittyPath);
    if (term) {
      sessions = sessions.filter(s => s.session.toLowerCase().indexOf(term.toLowerCase()) > -1)
    }
    return (
      <div className={styles.wrapper}>
        <KeyboardNav>
          <ul className={styles.list}>
            {
              sessions.map(s => (
                <KeyboardNavItem
                  key={s.folder + s.session}
                  tagName={'li'}
                  onSelect={() => callback(s)}
                >
                  {s.folder !== '' && 
                    <span className={styles.folder}>[{s.folder}]</span>
                  }
                  {s.session}
                </KeyboardNavItem>
              ))
            }
          </ul>
        </KeyboardNav>
      </div>
    );
  }
}

Preview.propTypes = {
  kittyPath: PropTypes.string.isRequired,
  term: PropTypes.string,
  callback: PropTypes.func.isRequired
}

export default Preview