import React, { useEffect, useState } from 'react';
import style from './DepositCalculator.css';
import { Select, Slider } from 'antd';
import { Deposit } from 'src/types';
import { calculateIncome, generatePDF, toLocalDecimalString } from 'caComponents/utils';
import { InfoBadge } from 'caComponents/InfoBadge/InfoBadge';
import cx from 'classnames';
import { MAX_DEPOSIT_SUMM, MAX_PERIOD, Step } from 'caComponents/AppContainer/constants';

const { Option } = Select;
interface Props {
    deposits: Deposit[];
}

const DepositCalculator: React.FC<Props> = ({ deposits }) => {
    const [deposit, setDeposit] = useState(deposits[0]);
    const initialDepositAttributes = {
        periodFrom: deposit.minPeriodFrom,
        summ: deposit.param[0].minSummFrom,
        rate: deposit.param[0].summsAndRate[0].rate,
    };
    const [depositAttributes, setDepositAttributes] = useState(initialDepositAttributes);

    const [income, setIncome] = useState(
        calculateIncome(depositAttributes.periodFrom, depositAttributes.summ, depositAttributes.rate),
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
            setDepositAttributes({ ...depositAttributes, rate: newRate });
        }
        const newIncome = calculateIncome(depositAttributes.periodFrom, summ, newRate);
        setIncome(newIncome);
    };

    useEffect(() => {
        const { periodFrom, summ } = depositAttributes;
        calculateHandler(periodFrom, summ);
    }, [depositAttributes.summ, depositAttributes.periodFrom]);

    const selectChangeHandler = (code: string) => {
        const newDepositAttributes = deposits.find((deposit) => deposit.code === code);
        if (newDepositAttributes) {
            const { minPeriodFrom, param } = newDepositAttributes;
            setDeposit(newDepositAttributes);
            setDepositAttributes({
                periodFrom: minPeriodFrom,
                summ: param[0].minSummFrom,
                rate: param[0].summsAndRate[0].rate,
            });
            const newIncome = calculateIncome(minPeriodFrom, param[0].minSummFrom, param[0].summsAndRate[0].rate);
            setIncome(newIncome);
        }
    };

    const periodChangeHandler = (period: number) => {
        setDepositAttributes({ ...depositAttributes, periodFrom: period });
    };

    const sumChangeHandler = (summ: number) => {
        setDepositAttributes({ ...depositAttributes, summ });
    };

    const saveToPdfClickHandler = () => {
        const { periodFrom, summ, rate } = depositAttributes;
        const { name } = deposit;
        generatePDF(name, periodFrom, summ, rate, income);
    };
    const { periodFrom, summ, rate } = depositAttributes;
    const { minPeriodFrom } = deposit;

    return (
        <section className={style.calculation}>
            <div>
                <div className={style.wrapper}>
                    <h2 className={style.deposit}>Вклад</h2>
                    <Select
                        size="large"
                        className={style.select}
                        defaultValue={deposit.code}
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
                        <span className={style.parametrName}>
                            {`Сумма через `}
                            <span className={style.monthsCount}>{`${periodFrom} д`}</span>
                        </span>
                        <span className={style.parametrValue}>{`${toLocalDecimalString(income + summ, 2)} Р`}</span>
                    </li>
                    <li className={cx(style.parameter, style.income)}>
                        <span className={style.parametrName}>Доход</span>
                        <span className={style.parametrValue}>{`${toLocalDecimalString(income, 2)} Р`}</span>
                    </li>
                </ul>
            </div>
            <div className={style.info}>
                <picture>
                    <source type="image/webp" srcSet="/assets/img/credit@1x.webp 1x, /assets/img/credit@2x.webp 2x" />
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
                    Расчеты калькулятора являются предварительными. Для расчета дохода применяются процентные ставки,
                    действующие на момент проведения расчетов.
                </p>
            </div>
            <button className={style.saveToPdfBtn} onClick={saveToPdfClickHandler}>
                Сохранить в PDF
            </button>
        </section>
    );
};

export default DepositCalculator;
