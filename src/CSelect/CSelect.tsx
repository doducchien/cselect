import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import './cselect.scss'
import { COption } from './model/COption'
import { cloneDeep, divide } from 'lodash'
import ArrowDown from './img/arrow-down.svg'
import XClose from './img/x-close.svg'
import { checkAtLeastOneOptionWasSelected, expandOrCollapseOptions, getCurrentNode, getPairSelected, getPathOfOptionSelected, getRest, selectOrUnSelectAll, selectOrUnselectAllParentNode, selectedOrUnselectedAll } from './func/functions'
import { useClickOutside } from '@mantine/hooks'

interface CSelectProps {
    options: COption[]
    width?: number,
    height?: number,
    optionsAreaMaxHeight?: number,
    onChange: (options: COption[]) => void
}










function genderListOption(options: COption[], onClickOption: (uuid: string) => void, onExpandCollapse: (uuid: string) => void): JSX.Element[] {
    let result: JSX.Element[] = []

    jsonToUI(options)
    function jsonToUI(options: COption[]): any {
        // debugger
        for (let i = 0; i < options.length; i++) {
            const currentOption = options[i];
            const { level, show, value, uuid, selected, childOptions } = currentOption;

            if (currentOption.childOptions.length === 0) result.push(
                <div
                    key={uuid}
                    className='option'
                    style={{ paddingLeft: 10 + level * 22, display: show ? 'flex' : 'none' }}
                    data-level={level}
                    data-value={value}
                    data-uuid={uuid}
                >
                    <label className="containers">
                        <input type="checkbox" disabled checked={selected || false} />
                        <span className="checkmark" onClick={() => onClickOption((uuid))}></span>
                    </label>
                    <div className='label' onClick={() => onExpandCollapse(uuid)}>
                        {currentOption.label}
                        {childOptions.length > 0 && <img src={ArrowDown} alt="" />}
                    </div>




                </div>
            );
            else {

                result.push(
                    <div
                        key={uuid}
                        className='option'
                        style={{ paddingLeft: 10 + level * 22, display: show ? 'flex' : 'none' }}
                        data-level={level}
                        data-value={value}
                        data-uuid={uuid}

                    >
                        <label className="containers">
                            <input type="checkbox" disabled checked={selected || false} />
                            <span className="checkmark" onClick={() => onClickOption((uuid))}></span>
                        </label>
                        <div className='label' onClick={() => onExpandCollapse(uuid)}>
                            {currentOption.label}
                            {childOptions.length > 0 && <img src={ArrowDown} alt="" />}

                        </div>

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
    const [optionsState, setOptionsState] = useState<COption[]>(options);
    const [selected, setSelected] = useState<boolean>(false);
    const [pairs, setPairs] = useState<string[][]>([]);
    const [isOpenList, setIsOpenList] = useState<boolean>(false);
    const ref = useClickOutside(()=> setIsOpenList(false));

  
    useEffect(()=>{
        setOptionsState(options);
    }, [options])

    useEffect(() => {
        const atLeastOneOptionWasSelected = checkAtLeastOneOptionWasSelected(optionsState);
        setSelected(atLeastOneOptionWasSelected);
    }, [optionsState])


    const onExpandCollapse = (uuid: string) => {
        const paths = getPathOfOptionSelected(optionsState, uuid);
        const optionsClone = cloneDeep(optionsState);
        const currentNode = getCurrentNode(optionsClone, paths);
        let isExpand = currentNode?.childOptions.every(item => item.show);
        if (isExpand) expandOrCollapseOptions(getRest(optionsClone, paths), false);
        else {
            currentNode?.childOptions.map(item => {
                item.show = true;
                return item;
            })
        }
        setOptionsState(optionsClone);

    }

    const onClickOption = (uuid: string) => {
        const paths = getPathOfOptionSelected(optionsState, uuid);
        const optionsClone = cloneDeep(optionsState);


        let currentNode = getCurrentNode(optionsClone, paths);
        if (!currentNode) return;
        if (!currentNode.selected) {
            currentNode.selected = true;
            selectedOrUnselectedAll(getRest(optionsClone, paths), true)
        }
        else {
            currentNode.selected = false;
            selectedOrUnselectedAll(getRest(optionsClone, paths), false)

        }

        selectOrUnselectAllParentNode(optionsClone, paths)
        setPairs(getPairSelected(optionsClone));
        setOptionsState(optionsClone);
        props.onChange(optionsClone);


    }

    const onSelectAll = () => {
        const optionsClone = cloneDeep(optionsState);

        selectOrUnSelectAll(optionsClone, true);
        setPairs(getPairSelected(optionsClone))
        setOptionsState(optionsClone)
        props.onChange(optionsClone);

    }
    const onUnselectAll = () => {
        const optionsClone = cloneDeep(optionsState);

        selectOrUnSelectAll(optionsClone, false);
        setPairs(getPairSelected(optionsClone))
        setOptionsState(optionsClone)
        props.onChange(optionsClone);

    }

    const onDiscardPair = (paths: string[]) => {


        const optionsClone = cloneDeep(optionsState);
        let newPath = [...paths].map(item =>{
            let [uuid] = item.split(';');
            return uuid;
        })


        let currentNode = getCurrentNode(optionsClone, newPath);
        if (!currentNode) return;

        currentNode.selected = false;
        selectedOrUnselectedAll(getRest(optionsClone, newPath), false)
        selectOrUnselectAllParentNode(optionsClone, newPath)
        setPairs(getPairSelected(optionsClone));
        setOptionsState(optionsClone);
        props.onChange(optionsClone);




    }

    const pairsToUI = (pairs: string[][], onDiscardPair: (paths: string[])=>void): JSX.Element[] => {
        let results: JSX.Element[] = [];
        for (let i = 0; i < pairs.length; i++) {
            let result: JSX.Element[] = [];
            const pair = pairs[i];

            for (let j = 0; j < pair.length; j++) {
                const [uuid, label, value] = pair[j].split(';');
                let style;
                if (j % 2 === 0) style = {
                    backgroundColor: '#88A9EC',
                    color: 'white',
                }
                else style = {
                    backgroundColor: 'white',
                    color: '#4F6CA7'
                }
                result.push(<span key={j} className='tag' style={style}>{`${label}`}</span>)
            }
            let element = (
                <div className='element' key={i}>
                    {result}
                    <span className='discard'><img src={XClose} alt="" onClick={()=>onDiscardPair(pair)} /></span>
                </div>
            )
            results.push(element);
        }

        return results;
    }


    // getParentNode(options, ['B', 'B1', 'B12'])
    // getCurrentNode(options, ['A', 'A1'])
    // selectedRest(options, ['A', 'A1'])
    // console.log(getPairSelected(optionsState))
    // console.log(optionsState)
    // console.log({ pairs })


    return (
        <div 
        className='cselect'
         style={{ width: props.width, height: props.height }}
        onClick={()=> setIsOpenList(true)}
         ref={ref} 
         >
            <div className="result c-select" ref={ref}>
                {pairsToUI(pairs, onDiscardPair)}
            </div>

            <div className='options' style={{display: isOpenList ? 'block': 'none'}}>
                <div>
                    <label className="select-all">
                        <input type="checkbox" disabled checked={selected} />
                        <span className="checkmark" onClick={selected ? onUnselectAll : onSelectAll}></span>
                    </label>
                </div>
                <div className='line'></div>
                <div className='list-options' style={{maxHeight: props?.optionsAreaMaxHeight, overflow: 'auto'}}>
                    {genderListOption(optionsState, onClickOption, onExpandCollapse)}
                </div>

            </div>
        </div>
    )
}
