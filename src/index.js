import React from 'react'
import Preview from './Preview'
import iconPath from './icon.png'
import { spawn } from 'child_process'

export const icon = iconPath

export const fn = ({ term, display, actions, settings }) => {
  let match = term.match(/^kitty\s+(.+)?/i);
  
  var openSession = (session) => {
    if(session.session) {
      if (session.folder === '') {
        spawn(settings.kittyPath + 'kitty.exe', ['-load', session.session], {detached: true});
      } else {
        console.log(settings.kittyPath + 'kitty.exe' + ' -folder ' + session.folder + ' -load ' + session.session);
        spawn(settings.kittyPath + 'kitty.exe', ['-folder', session.folder, '-load', session.session], {detached: true});
      }
    }
    actions.hideWindow();
  }

  if(match) {
    display({
      icon,
      title: 'Kitty',
      subtitle: 'Opens kitty SSH sessions',
      onSelect: () => openSession({folder: '', session: match[1]}),
      getPreview: () => <Preview term={match[1]} kittyPath={settings.kittyPath} callback={openSession}/>
    });
  }
}

export const settings = {
  kittyPath: { 
    label: 'Kitty home directory',
    type: 'string',
    description: 'Full path to Kitty home directory eg. C:\\Program Files\\Kitty\\'
  }
}