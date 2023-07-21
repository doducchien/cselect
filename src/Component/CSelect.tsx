import React, { ReactElement, ReactNode } from 'react'
import './cselect.scss'
import { COption } from './model/COption'
import { JSX } from 'react/jsx-runtime'



interface CSelectProps {
    options: COption[]
}

function getPathOfOptionSelected(options: COption[], uuid: string) {


    let result: string[] = [];
    let success = false;
    function trace(options: COption[]) {

        let i = 0;
        for (i = 0; i < options.length; i++) {
            if (success) break;
            const currentOption = options[i];
            const { value, uuid: currentUuid } = currentOption;

            result.push(value)

            if (currentOption.childOptions.length === 0) {
                if (currentUuid === uuid) {
                    success = true;
                    return;
                }
                result.pop()
                continue;
            }

            if (currentUuid === uuid) {
                success = true;
                return;
            }


            trace(currentOption.childOptions)

        }
        if (i === options.length && !success) {
            result.pop();
        }


    }
    trace(options);
    console.log(result)
    return result;
}



function genderListOption(options: COption[], onClickOption: (uuid: string) => void): JSX.Element[] {
    let result: JSX.Element[] = []

    jsonToUI(options)
    function jsonToUI(options: COption[]): any {
        // debugger
        for (let i = 0; i < options.length; i++) {
            const currentOption = options[i];
            const { level, expand, value, uuid } = currentOption;

            if (currentOption.childOptions.length === 0) result.push(
                <div
                    key={uuid}
                    className='option'
                    style={{ paddingLeft: 10 + level * 15, display: expand ? 'block' : 'none' }}
                    data-level={level}
                    data-value={value}
                    data-uuid={uuid}
                    onClick={() => onClickOption(uuid)}
                >
                    {currentOption.label}
                </div>
            );
            else {

                result.push(
                    <div
                        key={uuid}
                        className='option'
                        style={{ paddingLeft: 10 + level * 15, display: expand ? 'block' : 'none' }}
                        data-level={level}
                        data-value={value}
                        data-uuid={uuid}
                        onClick={() => onClickOption((uuid))}

                    >
                        {currentOption.label}
                    </div>
                )
                jsonToUI(currentOption.childOptions)


            }
        }

    }

    return result;


}


export default function CSelect(props: CSelectProps) {
    const { options } = props;

    console.log({ options })
    const onClickOption = (uuid: string) => {
        console.log({ uuid })
        getPathOfOptionSelected(options, uuid);
    }

    return (
        <div className='cselect'>
            <div className="result" contentEditable></div>
            <div className='options'>
                {genderListOption(options, onClickOption)}
            </div>
        </div>
    )
}
