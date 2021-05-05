import React, { useState } from 'react';
import style from './AppContainer.css';
import { Select } from 'antd';
import { Slider } from 'antd';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import { Deposit } from 'src/types';
import { mockDeposits } from '../../mock/mockDeposits';
import { calculateIncome, toLocalDecimalString, transformDeposits } from 'caComponents/utils';
import { InfoBadge } from 'caComponents/InfoBadge/InfoBadge';

const { Option } = Select;
const deposits: Deposit[] = transformDeposits(mockDeposits);

const AppContainer = ({ isFetching = false }) => {
    const [selectedDeposit, setSelectedDeposit] = useState(deposits[0]);
    const [periodFrom, setPeriodFrom] = useState(selectedDeposit.minPeriodFrom);
    const [summ, setSumm] = useState(selectedDeposit.param[0].minSummFrom);
    const [rate, setRate] = useState(selectedDeposit.param[0].summsAndRate[0].rate);
    const [income, setIncome] = useState(calculateIncome(periodFrom, summ, rate));

    const calculateHandler = (period: number, summ: number) => {
        const foundParam = selectedDeposit.param.find(
            (parameter) => period >= parameter.periodFrom && period <= parameter.periodTo,
        );
        const summAndRate = foundParam?.summsAndRate.find(
            (parameter) => summ >= parameter.summFrom && summ <= parameter.summTo,
        );

        const rate = summAndRate?.rate;
        if (rate) {
            setRate(rate);
        }
        setIncome(calculateIncome(periodFrom, summ, rate));
    };

    const selectChangeHandler = (code: string) => {
        const selectedDeposit = deposits?.find((deposit) => deposit.code === code);
        if (selectedDeposit) {
            setSelectedDeposit(selectedDeposit);
            setPeriodFrom(selectedDeposit.minPeriodFrom);
            setSumm(selectedDeposit.param[0].minSummFrom);
            setRate(selectedDeposit.param[0].summsAndRate[0].rate);
            setIncome(
                calculateIncome(
                    selectedDeposit.minPeriodFrom,
                    selectedDeposit.param[0].minSummFrom,
                    selectedDeposit.param[0].summsAndRate[0].rate,
                ),
            );
        }
    };

    const periodChangeHandler = (period: number) => {
        setPeriodFrom(period);
        calculateHandler(period, summ);
    };

    const sumChangeHandler = (summ: number) => {
        setSumm(summ);
        calculateHandler(periodFrom, summ);
    };

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
                                        min={selectedDeposit.minPeriodFrom}
                                        max={365}
                                        step={1}
                                        value={periodFrom}
                                        tooltipVisible={false}
                                        onChange={periodChangeHandler}
                                    />
                                    <div className={style.extraInfo}>
                                        <InfoBadge title="Тooltip 1" text="Text of tooltip 1" />
                                    </div>
                                </div>
                                <div className={style.range}>
                                    <div className={style.legend}>
                                        <span className={style.legendTitle}>Сумма вклада</span>
                                        <span className={style.legendValue}>{`${toLocalDecimalString(summ)} Р`}</span>
                                    </div>
                                    <Slider
                                        min={selectedDeposit.param[0].minSummFrom}
                                        max={1000000000}
                                        step={1}
                                        value={summ}
                                        tooltipVisible={false}
                                        onChange={sumChangeHandler}
                                    />
                                    <div className={style.extraInfo}>
                                        <InfoBadge title="Тooltip 2" text="Text of tooltip 2" />
                                    </div>
                                </div>
                            </div>
                            <ul className={style.depositParameters}>
                                <li className={style.parameter}>
                                    <span className={style.parametrName}>Процентная ставка</span>
                                    <span className={style.parametrValue}>{`${toLocalDecimalString(rate, 1)}%`}</span>
                                </li>
                                <li className={style.parameter}>
                                    <span className={style.parametrName}>{`Сумма через ${periodFrom} д`}</span>
                                    <span className={style.parametrValue}>
                                        {`${toLocalDecimalString(income + summ, 2)} Р`}
                                    </span>
                                </li>
                                <li className={style.parameter}>
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
                    </section>
                )}
            </Spin>
        </div>
    );
};

export default observer(AppContainer);
