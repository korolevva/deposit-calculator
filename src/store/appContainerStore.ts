import { Deposit } from 'src/types';
import { mockDeposits } from './../mock/mockDeposits';
import { observable, makeObservable, action } from 'mobx';
import { emulateRequestDelay, Result, Timeout } from './utils';
import { transformDeposits } from 'caComponents/utils';

const result: Result = {
    errorMessage: 'Ошибка загрузки данных',
    data: mockDeposits,
};

const delay: Timeout = { min: 300, max: 400 };
const successRate = 80;

export class AppContainerStore {
    deposits: Deposit[] | null;
    error: Error | null;
    isFetching: boolean;
    constructor() {
        this.deposits = null;
        this.isFetching = true;
        makeObservable(this, {
            deposits: observable,
            loadDeposits: action,
            isFetching: observable,
        });
    }

    loadDeposits = async () => {
        try {
            const deposits = await emulateRequestDelay(successRate, delay, result);
            this.deposits = transformDeposits(deposits);
            this.isFetching = false;
        } catch (e) {
            this.error = e;
            this.isFetching = false;
        }
    };
}
