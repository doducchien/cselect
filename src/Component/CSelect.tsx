import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import './cselect.scss'
import { COption } from './model/COption'
import { JSX } from 'react/jsx-runtime'
import { cloneDeep, divide } from 'lodash'
import ArrowDown from '../img/arrow-down.svg'
import XClose from '../img/x-close.svg'

interface CSelectProps {
    options: COption[]
    width?: number,
    height?: number
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
    return result;
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
                    <label className="container">
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
                        <label className="container">
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


    useEffect(() => {
        const atLeastOneOptionWasSelected = checkAtLeastOneOptionWasSelected(optionsState);
        setSelected(atLeastOneOptionWasSelected);
    }, [optionsState])



    function getCurrentNode(options: COption[], paths: string[]): COption | null {
        let optionsCopy = options;
        for (let i = 0; i < paths.length - 1; i++) {
            const path = paths[i]
            let currentOptionsIndex = optionsCopy.findIndex(item => item.value === path);
            if (currentOptionsIndex === -1) return null;
            optionsCopy = optionsCopy[currentOptionsIndex].childOptions;

        }
        let lastPath = paths[paths.length - 1];
        let result = optionsCopy.find(item => item.value === lastPath) || null;
        return result;
    }


    function getRest(options: COption[], paths: string[]): COption[] {
        let rest = options;
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i]
            let currentOptionsIndex = rest.findIndex(item => item.value === path);
            if (currentOptionsIndex === -1) return [];
            rest = rest[currentOptionsIndex].childOptions;

        }
        return rest;
    }

    function getParentNode(options: COption[], paths: string[]): COption | null {
        let newPath = cloneDeep(paths);
        newPath.pop();
        const result = getCurrentNode(options, newPath);
        return result;
    }

    function expandOrCollapseOptions(options: COption[], selected: boolean): void {
        for (let i = 0; i < options.length; i++) {
            options[i].show = selected;
            if (options[i].childOptions.length === 0) continue;
            expandOrCollapseOptions(options[i].childOptions, selected)
        }
    }






    function selectedOrUnselectedAll(options: COption[], selected: boolean): void {
        for (let i = 0; i < options.length; i++) {
            options[i].selected = selected;
            selectedOrUnselectedAll(options[i].childOptions, selected);
        }
    }

    function selectOrUnselectAllParentNode(options: COption[], paths: string[]): void {
        const pathsClone = [...paths];
        while (pathsClone.length > 0) {
            let parentNode = getParentNode(options, pathsClone);
            if (!parentNode) return;
            if (parentNode?.childOptions.some(item => item.selected)) parentNode.selected = true;
            else parentNode.selected = false;
            pathsClone.pop();
        }

    }

    function expandOrCollapseChildren(options: COption[], paths: string[]): void {
        let currentNode = getCurrentNode(options, paths);
        let rest = getRest(options, paths);
        let isExpand = currentNode?.childOptions.every(item => item.show);
        currentNode?.childOptions.map(item => {
            item.show = !isExpand;
            return item;
        })
    }

    function selectOrUnSelectAll(options: COption[], selected: boolean) {
        for (let i = 0; i < options.length; i++) {
            options[i].selected = selected;
            if (options[i].childOptions.length === 0) continue;
            selectOrUnSelectAll(options[i].childOptions, selected);
        }
    }

    function checkAtLeastOneOptionWasSelected(options: COption[]): boolean {
        for (let i = 0; i < options.length; i++) {
            const currentOption = options[i];
            if (currentOption.selected) return true;
            if (currentOption.childOptions.length === 0) continue;
            checkAtLeastOneOptionWasSelected(currentOption.childOptions)
        }
        return false;
    }

    function getPairSelected(options: COption[]): string[][] {
        let result: string[][] = [];
        let path: string[] = []
        loopSelected(options);
        function loopSelected(options: COption[]) {
            // debugger
            for (let i = 0; i < options.length; i++) {
                const currentOptions = options[i];
                const { value, selected, childOptions } = currentOptions;
                if (!selected) continue;

                path.push(value);
                if (childOptions.length === 0) {
                    result.push([...path]);
                    path.pop();
                    continue;
                }

                loopSelected(currentOptions.childOptions);
                path.pop();
            }
        }

        return result;

    }





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

    }

    const onSelectAll = () => {
        const optionsClone = cloneDeep(optionsState);

        selectOrUnSelectAll(optionsClone, true);
        setPairs(getPairSelected(optionsClone))
        setOptionsState(optionsClone)
    }
    const onUnselectAll = () => {
        const optionsClone = cloneDeep(optionsState);

        selectOrUnSelectAll(optionsClone, false);
        setPairs(getPairSelected(optionsClone))
        setOptionsState(optionsClone)
    }

    const onDiscardPair = (paths: string[]) => {


        const optionsClone = cloneDeep(optionsState);


        let currentNode = getCurrentNode(optionsClone, paths);
        if (!currentNode) return;

        currentNode.selected = false;
        selectedOrUnselectedAll(getRest(optionsClone, paths), false)
        selectOrUnselectAllParentNode(optionsClone, paths)
        setPairs(getPairSelected(optionsClone));
        setOptionsState(optionsClone);




    }

    const pairsToUI = (pairs: string[][], onDiscardPair: (paths: string[])=>void): JSX.Element[] => {
        let results: JSX.Element[] = [];
        for (let i = 0; i < pairs.length; i++) {
            let result: JSX.Element[] = [];
            const pair = pairs[i];

            for (let j = 0; j < pair.length; j++) {
                let style;
                if (j % 2 === 0) style = {
                    backgroundColor: '#88A9EC',
                    color: 'white',
                }
                else style = {
                    backgroundColor: 'white',
                    color: '#4F6CA7'
                }
                const text = pair[j];
                result.push(<span className='tag' style={style}>{`${text}`}</span>)
            }
            let element = (
                <div className='element'>
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
        <div className='cselect' style={{ width: props.width, height: props.height }}>
            <div className="result">
                {pairsToUI(pairs, onDiscardPair)}
            </div>

            <div className='options'>
                <div>
                    <label className="select-all">
                        <input type="checkbox" disabled checked={selected} />
                        <span className="checkmark" onClick={selected ? onUnselectAll : onSelectAll}></span>
                    </label>
                </div>
                <div className='line'></div>
                <div className='list-options'>
                    {genderListOption(optionsState, onClickOption, onExpandCollapse)}
                </div>

            </div>
        </div>
    )
}
