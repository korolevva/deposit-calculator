import React from 'react';
import style from './AppContainer.css';
import { Select } from 'antd';
const { Option } = Select;
import { Slider } from 'antd';

const AppContainer = () => {
    return (
        <div className={style.container}>
            <h1 className={style.title}>Депозитный калькулятор</h1>
            <section className={style.calculation}>
                <div>
                    <div className={style.wrapper}>
                        <h2 className={style.deposit}>Вклад</h2>
                        <Select
                            defaultValue="Универсальный"
                            size="large"
                            className={style.select} /* onChange={handleChange} */
                        >
                            <Option value="Универсальный">Универсальный</Option>
                            <Option value="Стандартный">Стандартный</Option>
                            <Option value="Пополняемый">Пополняемый</Option>
                        </Select>
                        <div className={style.range}>
                            <div className={style.legend}>
                                <span className={style.legendTitle}>Срок вклада</span>
                                <span className={style.legendValue}>24 мес.</span>
                            </div>
                            <Slider defaultValue={24} min={0} max={48} step={1} />
                            <div className={style.extraInfo}>
                                <div className={style.tooltip}>
                                    <span className={style.tooltipTitle}>Тooltip 2</span>
                                    <p className={style.tooltipText}>Text of tooltip 2</p>
                                </div>
                            </div>
                        </div>
                        <div className={style.range}>
                            <div className={style.legend}>
                                <span className={style.legendTitle}>Сумма вклада</span>
                                <span className={style.legendValue}>1 200 000 Р</span>
                            </div>
                            <Slider defaultValue={24} min={0} max={48} step={1} />
                        </div>
                    </div>
                    <ul className={style.depositParameters}>
                        <li className={style.parameter}>
                            <span className={style.parametrName}>Процентная ставка</span>
                            <span className={style.parametrValue}>12,1%</span>
                        </li>
                        <li className={style.parameter}>
                            <span className={style.parametrName}>Сумма через 24 мес</span>
                            <span className={style.parametrValue}>1 223 155,00 Р</span>
                        </li>
                        <li className={style.parameter}>
                            <span className={style.parametrName}>Доход</span>
                            <span className={style.parametrValue}>23 155,00 Р</span>
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
                        Расчеты калькулятора являются предварительными. Для расчета дохода применяются процентные
                        ставки, действующие на момент проведения расчетов.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default AppContainer;
