import { Deposit, DepositAPI, Parameter, ParameterAPI, SummsAndRate, SummsAndRateAPI } from 'src/types';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { MAX_DEPOSIT_SUMM, MAX_PERIOD } from './AppContainer/constants';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const transformSummAndRate = (summsAndRate: SummsAndRateAPI[]) => {
    return summsAndRate.reduce(
        (acc: SummsAndRate[], summAndRate: SummsAndRateAPI, index: number, array: SummsAndRateAPI[]) => {
            const nextIndex = index + 1;
            const summTo =
                nextIndex === array.length
                    ? MAX_DEPOSIT_SUMM
                    : array[nextIndex].summ_from - array[index].summ_from > 1
                    ? array[nextIndex].summ_from - 1
                    : array[index].summ_from;
            const transformedSummsAndRate = {
                summFrom: summAndRate.summ_from,
                summTo,
                rate: summAndRate.rate,
            };
            acc.push(transformedSummsAndRate);
            return acc;
        },
        [] as SummsAndRate[],
    );
};

const transformParam = (params: ParameterAPI[]): Parameter[] => {
    return params.reduce((acc: Parameter[], param: ParameterAPI, index: number, array: ParameterAPI[]) => {
        const transformedSummAndRate = transformSummAndRate(param.summs_and_rate);
        const summsFrom = param.summs_and_rate.map(({ summ_from }) => summ_from);
        const minSummFrom = Math.min(...summsFrom);
        const nextIndex = index + 1;
        const periodTo =
            nextIndex === array.length
                ? MAX_PERIOD
                : array[nextIndex].period_from - array[index].period_from > 1
                ? array[nextIndex].period_from - 1
                : array[index].period_from;
        const transformedParams = {
            periodFrom: param.period_from,
            periodTo,
            minSummFrom,
            summsAndRate: transformedSummAndRate,
        };
        acc.push(transformedParams);
        return acc;
    }, []);
};

export const transformDeposits = (deposits: DepositAPI[]): Deposit[] => {
    return deposits.reduce((acc: Deposit[], deposit: DepositAPI) => {
        const transormedParam = transformParam(deposit.param);

        const periodsFrom = deposit.param.map((parameter) => parameter.period_from);
        const minPeriodFrom = Math.min(...periodsFrom);

        const transformedDeposit: Deposit = {
            code: deposit.code,
            name: deposit.name,
            minPeriodFrom,
            param: transormedParam,
        };
        acc.push(transformedDeposit);
        return acc;
    }, []);
};

export const calculateIncome = (period: number, summ: number, rate = 1) => {
    const interestAmount = (rate / 100) * summ;
    return (interestAmount / 365) * period;
};

const DEFAULT_EMPTY_VALUE = '\u2014';
export const toLocalDecimalString = (
    value: number | string | null | undefined,
    fractionDigits?: number,
    emptyValue?: string,
): string => {
    let numberValue = 0;
    const isNumeric = value !== null && value !== undefined && !isNaN(Number(value));
    if (isNumeric) {
        numberValue = Number(value);
    }
    const localeString = numberValue.toLocaleString('ru-RU', {
        maximumFractionDigits: fractionDigits || 0,
        minimumFractionDigits: fractionDigits || 0,
    });
    return isNumeric ? localeString : emptyValue || DEFAULT_EMPTY_VALUE;
};

export const generatePDF = (name: string, periodFrom: number, summ: number, rate: number, income: number) => {
    const documentDefinition: TDocumentDefinitions = {
        content: [
            {
                style: 'title',
                text: 'Расчет депозита',
            },
            {
                style: 'text',
                text: [
                    { text: `\n\nВклад: `, bold: true },
                    `${name}\n\n`,
                    { text: `Срок вклада: `, bold: true },
                    `${periodFrom} д.\n\n`,
                    { text: `Сумма вклада: `, bold: true },
                    `${toLocalDecimalString(summ, 2)} Р\n\n`,
                    { text: `Процентная ставка: `, bold: true },
                    `${toLocalDecimalString(rate, 1)}%\n\n`,
                    { text: `Сумма через ${periodFrom} д.: `, bold: true },
                    `${toLocalDecimalString(income + summ, 2)} Р\n\n`,
                    { text: `Доход: `, bold: true },
                    `${toLocalDecimalString(income, 2)} Р\n\n`,
                ],
            },
        ],
        styles: {
            title: {
                fontSize: 20,
                bold: true,
                alignment: 'center',
            },
            text: {
                fontSize: 13,
            },
        },
    };
    pdfMake.createPdf(documentDefinition).download('deposit-calculator');
};
