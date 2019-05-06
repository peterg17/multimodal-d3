import _ from 'lodash';
import './style.css';
import data from './test.json';

function component() {
    var element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    return element;
}

function jsonDump() {
  var element = document.createElement('div');
  element.innerHTML = _.join([data.name, data.value], ' ');
  return element;
}



document.body.appendChild(component());
document.body.appendChild(jsonDump());