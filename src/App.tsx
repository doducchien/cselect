import React from 'react';
import logo from './logo.svg';
import './App.css';
import CSelect from './Component/CSelect';
import { COption } from './Component/model/COption';



function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const cOption: COption[] = [
  {
    uuid: generateUUID(),
    label: 'A',
    value: 'A',
    level: 0,
    show: true,
    childOptions: [
      
      {
        uuid: generateUUID(),
        label: 'A1',
        value: 'A1',
        level: 1,
        show: false,
        childOptions: [
          {
            uuid: generateUUID(),
            label: 'A11',
            value: 'A11',
            level: 2,
            show: false,
            childOptions: []
          },
          {
            uuid: generateUUID(),
            label: 'A12',
            value: 'A12',
            level: 2,
            show: false,
            childOptions: []
          },
        ]
      },
      {
        uuid: generateUUID(),
        label: 'A2',
        value: 'A2',
        level: 1,
        show: false,
        childOptions: []
      },
    ]
  },
  {
    label: 'B',
    value: 'B',
    level: 0,
    show: true,
    uuid: generateUUID(),

    childOptions: [
      {
        uuid: generateUUID(),
        label: 'B1',
        value: 'B1',
        level: 1,
        show: false,

        childOptions: [
          {
            uuid: generateUUID(),
            label: 'B11',
            value: 'B11',
            level: 2,
            show: false,
            childOptions: []
          },
          {
            uuid: generateUUID(),
            label: 'B12',
            value: 'B12',
            level: 2,
            show: false,
            childOptions: []
          },
        ]
      },
      {
        uuid: generateUUID(),
        label: 'B2',
        value: 'B2',
        level: 1,
        show: false,

        childOptions: []
      }
    ]
  }
]
// function jsonToUI(options: COption[]): any {
//   // debugger
//   for (let i = 0; i < options.length; i++) {
//       const currentOption = options[i];
//       if (currentOption.childOptions.length === 0) console.log(currentOption.label);
//       else {
//           console.log(currentOption.label)
//           jsonToUI(currentOption.childOptions);
//       }
//   }

// }
// jsonToUI(cOption)
function App() {






  return (
    <div className="App">
      <CSelect options={cOption} width={500}/>
    </div>
  );
}

export default App;
