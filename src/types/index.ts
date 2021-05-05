export interface SummsAndRateAPI {
    summ_from: number;
    rate: number;
}

export interface ParameterAPI {
    period_from: number;
    summs_and_rate: SummsAndRateAPI[];
}

export interface DepositAPI {
    code: string;
    name: string;
    param: ParameterAPI[];
}

export interface MappedDepositAPI {
    [T: string]: {
        name: string;
        periodsFrom: number[];
    };
}

export interface SummsAndRate {
    summFrom: number;
    summTo: number;
    rate: number;
}

export interface Parameter {
    periodFrom: number;
    periodTo: number;
    minSummFrom: number;
    summsAndRate: SummsAndRate[];
}

export interface Deposit {
    code: string;
    name: string;
    minPeriodFrom: number;
    param: Parameter[];
}
