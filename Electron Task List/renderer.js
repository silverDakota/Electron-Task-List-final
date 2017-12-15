var applic = require('electron').remote;
var dialog = applic.dialog;
var fs = require('fs');

//adding eventListeners to the save and open buttons to run there functions
document.getElementById('save').addEventListener('click', saveFile);
document.getElementById('open').addEventListener('click', openFile);

//openFile function will open a file, like txt and display it in the textarea
function openFile() {
  // getting the file or files
  dialog.showOpenDialog((filenames) => {
    if (filenames === undefined) {
      alert("No Files where selected");
      return;
    }
    readFile(filenames[0]);
  })
}

//readFile reads in the data from the file. I wasnt sure if it would have been better to use the vue for loop but I couldnt get this working
//I think the data wonce read in needs to be split by the commas "," because they are saved that way but i couldnt figure out how in time.
function readFile(filepath) {
  fs.readFile(filepath, 'utf-8', (err, data) => {
    if (err) {
      alert("There was an error retreiving the file");
      return;
    }
    // outputting the raw data into the textarea
    var textArea = document.getElementById('output');
    textArea.value = data;

    /*
    var ul = document.getElementsByTagName('ul');
    var li = ul[0].getElementsByTagName('li');
    var textByLine = data.split(",");

    var array = new Array();
    for (var i = 0; i < li.length; i++) {
        array.push(li[data[i]].innerText)
    }
    */
  })
}

// saveFile does work and will save the ul li list items to a file.
function saveFile() {
  dialog.showSaveDialog((filename) => {
    if (filename === undefined) {
      alert("No File Name, this is required");
      return;
    }

    // getting the ul li values, putting them in an array and storing it in a file
    var ul = document.getElementsByTagName('ul');
    var li = ul[0].getElementsByTagName('li');
    var array = new Array();
    for (var i = 0; i < li.length; i++) {
      array.push(li[i].innerText)
    }

    //write the array data to the file chosen
    fs.writeFile(filename, array, (err) => {
      if (err) console.log(err);
      alert("the file was Successfully Saved");
    })
  })
}
