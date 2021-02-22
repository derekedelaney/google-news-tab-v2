import { useRef, useState } from 'react';
import cx from 'classnames';
import './styles.css';
import { useAppDispatch } from '../../context/AppContext';
import { ActionType, Topic } from '../../models';

interface AddTabProps {
    onTabAdded?: (topic: Topic) => void;
}

export function AddTab(props: AddTabProps) {
    const dispatch = useAppDispatch();
    const [expanded, setExpanded] = useState(false);
    const [inputHidden, setInputHidden] = useState(true);
    const [inputFinished, setInputFinished] = useState(false);
    const [doneHidden, setDoneHidden] = useState(true);
    const [input, setInput] = useState('');
    const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    function toggleInputs(callback?: Function) {
        if (expanded) {
            setDoneHidden(true);
            setTimeout(() => {
                setExpanded(false);
                setInputFinished(false);
            }, 100);
            setTimeout(() => {
                if (typeof callback === 'function') callback();
                setInput('');
                setInputHidden(true);
            }, 600);
        } else {
            setExpanded(true);
            setInputHidden(false);
            setTimeout(() => {
                inputRef.current?.focus();
                setDoneHidden(false);
                setInputFinished(true);
            }, 500);
        }
    }

    function save() {
        toggleInputs(() => {
            const topic = new Topic(input);
            dispatch({
                type: ActionType.ADD_TOPIC,
                topic,
            });
            if (props.onTabAdded) props.onTabAdded(topic);
        });
    }

    return (
        <div className="container">
            <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        save();
                    }
                }}
                className={cx('input', {
                    expanded,
                    collapsed: !expanded,
                    hide: inputHidden,
                    show: !inputHidden,
                })}
                type="text"
                placeholder="News Topic"
            />
            <div
                className={cx('circle', 'add', {
                    expanded,
                    collapsed: !expanded,
                })}
                onClick={() => {
                    toggleInputs();
                }}
            >
                +
            </div>
            <div
                onClick={() => {
                    save();
                }}
                className={cx('circle', 'done', {
                    hide: !inputFinished,
                    doneHide: doneHidden,
                    doneShow: !doneHidden,
                })}
            >
                ✓
            </div>
        </div>
    );
}
