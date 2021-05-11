import React, { useContext, useEffect } from 'react';
import style from './AppContainer.css';
import { observer } from 'mobx-react';
import { store } from 'caStore/index';
import DepositCalculator from 'caScreens/DepositCalculator/DepositCalculator';
import { Spin } from 'antd';
import cx from 'classnames';
import Error from 'caComponents/Error/Error';

const AppContainer = () => {
    const { appContainerStore } = useContext(store);
    const { isFetching, loadDeposits, deposits, error } = appContainerStore;

    useEffect(() => {
        loadDeposits();
    }, []);

    return (
        <div className={style.container}>
            <h1 className={style.title}>Депозитный калькулятор</h1>
            {isFetching && (
                <div className={cx(style.spin)}>
                    <Spin size="large" spinning={true} tip="Загрузка..." />
                </div>
            )}
            {error ? <Error /> : deposits && <DepositCalculator deposits={deposits} />}
        </div>
    );
};

export default observer(AppContainer);
