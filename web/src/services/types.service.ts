import { Injectable } from '@angular/core';

export interface ObjTxHashType {
    showTips: boolean;
    TipsType: string;
    msgTitle: string;
    msg: string;
    transactionHash: string;
}

@Injectable({
    providedIn: 'root'
})
export class TypesService {}
