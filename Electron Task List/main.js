/**
 Utilizing Electron: Create a Task List /  To Do List

Your app should create have:
A custom menu that can:

open a file
Add a new item
Clear all items
Toggle on and off the Developer Tools
Quit the Program
Your App should be able to:

Open a local file and display items read from the text file into your task list items
Save items in the task list to a local file
Add items to the task list
Delete items from the task list


File     |   Edit    |   Dev tools
Open     |Add item
         |Clear item
         |Quit
 */

const electron = require('electron');
const url = require('url');
const path = require('path');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;


//set environment left it on so you can inspect

//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

//app on ready to create the window and close
app.on('ready', _ => {
  console.log("ready");
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  //build the custom menu from template
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // on close the window closes the addWindow if it is open and nulls them for memory space
  mainWindow.on('closed', _ => {
    mainWindow = null;
    addWindow = null;
    app.quit();
    console.log('closed');
  });
});

//creating the second window to add tasks to main window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 350,
    height: 350
  });
  addWindow.loadURL(`file://${__dirname}/addWindow.html`);

  //on close set to null for garbage
  addWindow.on('closed', _ => {
    addWindow = null;
  });
}

//catching the add task to send its data
ipc.on('task:add', function(e, task) {
  mainWindow.webContents.send('task:add', task);
  addWindow.close();
});


//menu template
const template = [{
    // File section of the menu
    label: 'File',
    submenu: [{
      label: 'Open',
      click() {
        $.getScript('./renderer.js', function() { // I cant get the function from the renderer.js and the jquery isnt found even though ive added it in npm and the cdn
          openFile(); // doesn't work
        });
      }
    }]
  },
  {
    /// Edit section of the menu
    label: 'Edit',
    submenu: [{
        label: 'Add Item',
        accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
        click() {
          createAddWindow()
        }
      },
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('task:clear')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
]

//checking if the platform is apple for the work around
if (process.platform === 'darwin') {
  template.unshift({});
}

//if the product is not in production, which I left it in. show the Dev Tools
if (process.env.NODE_ENV !== 'production') {
  template.push({
    label: 'Developer Tools',
    submenu: [{
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
