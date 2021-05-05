import React from 'react';
import { Popover } from 'antd';
import * as style from './InfoBadge.css';

interface Props {
    title: string;
    text: string;
}

const generateInnerContent = (title: string, content: string) => {
    return (
        <div className={style.contentWrapper}>
            <span className={style.title}>{title}</span>
            <p className={style.text}>{content}</p>
        </div>
    );
};

export const InfoBadge: React.FC<Props> = ({ title, text }) => {
    const content = generateInnerContent(title, text);
    return (
        <Popover content={content} placement="right" trigger={['click', 'hover']}>
            <div className={style.infoIcon} />
        </Popover>
    );
};
