import React from 'react';
import logo from './logo.svg';
import './App.css';
import { COption } from './CSelect/model/COption';
import CSelect from './CSelect/CSelect';
import { generateUUID } from './CSelect/func/functions';





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
            childOptions: [
              {
                uuid: generateUUID(),
                label: 'A111',
                value: 'A111',
                level: 3,
                show: false,
                childOptions: []
              },
              {
                uuid: generateUUID(),
                label: 'A112',
                value: 'A112',
                level: 3,
                show: false,
                childOptions: []
              },
            ]
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

function App() {


  const onChange = (options: COption[]) => {
    console.log(options)
  }



  return (
    <div className="App">
      <CSelect
        onChange={onChange}
        options={cOption} width={500} />
    </div>
  );
}

export default App;
