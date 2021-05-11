import React from 'react';
import * as s from './Error.css';

export const MagnifierIcon = () => (
    <svg width="42" height="42" viewBox={`0 0 14 14`} fill="none">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.333496 6.16683C0.333496 2.94183 2.94183 0.333496 6.16683 0.333496C9.39183 0.333496 12.0002 2.94183 12.0002 6.16683C12.0002 7.63526 11.4594 8.97584 10.5659 10.0006L13.4837 12.926C13.6949 13.1378 13.6945 13.4808 13.4827 13.692C13.2709 13.9033 12.9279 13.9028 12.7166 13.691L9.78122 10.7479C8.7879 11.5323 7.53267 12.0002 6.16683 12.0002C2.94183 12.0002 0.333496 9.39183 0.333496 6.16683ZM10.9168 6.16683C10.9168 3.55016 8.7835 1.41683 6.16683 1.41683C3.55016 1.41683 1.41683 3.55016 1.41683 6.16683C1.41683 8.7835 3.55016 10.9168 6.16683 10.9168C8.7835 10.9168 10.9168 8.7835 10.9168 6.16683Z"
            fill={'var(--background_button)'}
        />
    </svg>
);

const ERROR = 'Произошла ошибка загрузки данных. Попробуйте перезагрузить страницу.';

const Error = () => {
    return (
        <div className={s.emptyList}>
            <MagnifierIcon />
            <p className={s.text}>{ERROR}</p>
        </div>
    );
};

export default Error;
