import { DepositAPI } from './../types/index';
export interface Timeout {
    min: number;
    max: number;
}

export interface Result {
    errorMessage: string;
    data: DepositAPI[];
}

export const getRandomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * max + min);
};

export const emulateRequestDelay = (
    successRateInPercent: number,
    timeoutInMs: Timeout,
    result: Result,
): Promise<DepositAPI[]> => {
    const { errorMessage, data } = result;
    const timeout = getRandomInteger(timeoutInMs.min, timeoutInMs.max);
    const isResolved = Math.random() < successRateInPercent / 100;
    return new Promise((resolve, reject) => {
        setTimeout(() => (isResolved ? resolve(data) : reject(new Error(errorMessage))), timeout);
    });
};
