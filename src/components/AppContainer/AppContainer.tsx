import React, { useEffect, useState } from 'react';
import style from './AppContainer.css';
import { Select, Slider, Spin } from 'antd';
import { observer } from 'mobx-react';
import { Deposit } from 'src/types';
import { mockDeposits } from '../../mock/mockDeposits';
import { calculateIncome, generatePDF, toLocalDecimalString, transformDeposits } from 'caComponents/utils';
import { InfoBadge } from 'caComponents/InfoBadge/InfoBadge';
import cx from 'classnames';

const { Option } = Select;

const deposits: Deposit[] = transformDeposits(mockDeposits);
export const MAX_PERIOD = 365;
export const MAX_DEPOSIT_SUMM = 1000000000;
const Step = {
    PERIOD: 1,
    SUMM: 500,
};

const AppContainer = ({ isFetching = false }) => {
    let deposit = deposits[0];
    const initialDeposit = {
        periodFrom: deposit.minPeriodFrom,
        summ: deposit.param[0].minSummFrom,
        rate: deposit.param[0].summsAndRate[0].rate,
    };
    const [selectedDeposit, setSelectedDeposit] = useState(initialDeposit);

    const [income, setIncome] = useState(
        calculateIncome(selectedDeposit.periodFrom, selectedDeposit.summ, selectedDeposit.rate),
    );

    const calculateHandler = (period: number, summ: number) => {
        const foundParam = deposit.param.find(
            (parameter) => period >= parameter.periodFrom && period <= parameter.periodTo,
        );
        const summAndRate = foundParam?.summsAndRate.find(
            (parameter) => summ >= parameter.summFrom && summ <= parameter.summTo,
        );

        const newRate = summAndRate?.rate;
        if (newRate) {
            setSelectedDeposit({ ...selectedDeposit, rate: newRate });
        }
        const newIncome = calculateIncome(selectedDeposit.periodFrom, summ, newRate);
        setIncome(newIncome);
    };

    useEffect(() => {
        const { periodFrom, summ } = selectedDeposit;
        calculateHandler(periodFrom, summ);
    }, [selectedDeposit.summ, selectedDeposit.periodFrom]);

    const selectChangeHandler = (code: string) => {
        const newSelectedDeposit = deposits?.find((deposit) => deposit.code === code);
        if (newSelectedDeposit) {
            deposit = newSelectedDeposit;
            setSelectedDeposit(initialDeposit);
            const newIncome = calculateIncome(
                newSelectedDeposit.minPeriodFrom,
                newSelectedDeposit.param[0].minSummFrom,
                newSelectedDeposit.param[0].summsAndRate[0].rate,
            );
            setIncome(newIncome);
        }
    };

    const periodChangeHandler = (period: number) => {
        setSelectedDeposit({ ...selectedDeposit, periodFrom: period });
    };

    const sumChangeHandler = (summ: number) => {
        setSelectedDeposit({ ...selectedDeposit, summ });
    };

    const saveToPdfClickHandler = () => {
        const { periodFrom, summ, rate } = selectedDeposit;
        const { name } = deposit;
        generatePDF(name, periodFrom, summ, rate, income);
    };
    const { periodFrom, summ, rate } = selectedDeposit;
    const { minPeriodFrom } = deposit;
    return (
        <div className={style.container}>
            <h1 className={style.title}>Депозитный калькулятор</h1>
            <Spin size="large" spinning={isFetching}>
                {!isFetching && deposits && (
                    <section className={style.calculation}>
                        <div>
                            <div className={style.wrapper}>
                                <h2 className={style.deposit}>Вклад</h2>
                                <Select
                                    size="large"
                                    className={style.select}
                                    defaultValue={deposits[0].code}
                                    onChange={selectChangeHandler}
                                >
                                    {deposits &&
                                        deposits.map((deposit) => (
                                            <Option key={deposit.code} value={deposit.code}>
                                                {deposit.name}
                                            </Option>
                                        ))}
                                </Select>
                                <div className={style.range}>
                                    <div className={style.legend}>
                                        <span className={style.legendTitle}>Срок вклада</span>
                                        <span className={style.legendValue}>{`${periodFrom} д`}</span>
                                    </div>
                                    <Slider
                                        min={minPeriodFrom}
                                        max={MAX_PERIOD}
                                        step={Step.PERIOD}
                                        value={periodFrom}
                                        tooltipVisible={false}
                                        onChange={periodChangeHandler}
                                    />
                                    <div className={style.extraInfo}>
                                        <InfoBadge title="Tooltip 1" text="Text of tooltip 1" />
                                    </div>
                                </div>
                                <div className={style.range}>
                                    <div className={style.legend}>
                                        <span className={style.legendTitle}>Сумма вклада</span>
                                        <span className={style.legendValue}>{`${toLocalDecimalString(summ)} Р`}</span>
                                    </div>
                                    <Slider
                                        min={deposit.param[0].minSummFrom}
                                        max={MAX_DEPOSIT_SUMM}
                                        step={Step.SUMM}
                                        value={summ}
                                        tooltipVisible={false}
                                        onChange={sumChangeHandler}
                                    />
                                    <div className={style.extraInfo}>
                                        <InfoBadge title="Tooltip 2" text="Text of tooltip 2" />
                                    </div>
                                </div>
                            </div>
                            <ul className={style.depositParameters}>
                                <li className={cx(style.parameter, style.rate)}>
                                    <span className={style.parametrName}>Процентная ставка</span>
                                    <span className={style.parametrValue}>{`${toLocalDecimalString(rate, 1)}%`}</span>
                                </li>
                                <li className={cx(style.parameter, style.summ)}>
                                    <span className={style.parametrName}>{`Сумма через ${periodFrom} д`}</span>
                                    <span className={style.parametrValue}>
                                        {`${toLocalDecimalString(income + summ, 2)} Р`}
                                    </span>
                                </li>
                                <li className={cx(style.parameter, style.income)}>
                                    <span className={style.parametrName}>Доход</span>
                                    <span className={style.parametrValue}>
                                        {`${toLocalDecimalString(income, 2)} Р`}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className={style.info}>
                            <picture>
                                <source
                                    type="image/webp"
                                    srcSet="/assets/img/credit@1x.webp 1x, /assets/img/credit@2x.webp 2x"
                                />
                                <img
                                    className={style.depositImage}
                                    src="/assets/img/credit@1x.png"
                                    srcSet="/assets/img/credit@2x.png 2x"
                                    alt="Альтернативное описание картинки"
                                    width={290}
                                    height={182}
                                />
                            </picture>
                            <p className={style.infoText}>
                                Расчеты калькулятора являются предварительными. Для расчета дохода применяются
                                процентные ставки, действующие на момент проведения расчетов.
                            </p>
                        </div>
                        <button className={style.saveToPdfBtn} onClick={saveToPdfClickHandler}>
                            Сохранить в PDF
                        </button>
                    </section>
                )}
            </Spin>
        </div>
    );
};

export default observer(AppContainer);
