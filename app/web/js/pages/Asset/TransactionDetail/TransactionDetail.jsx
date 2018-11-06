/*
 * huangzongzhe
 * 2018.07.27
 */
import React, { Component } from 'react'
import { WhiteSpace, List, InputItem, Button, Toast } from 'antd-mobile'
import style from './TransactionDetail.scss'
import { hashHistory } from 'react-router'

import NavNormal from '../../NavNormal/NavNormal'

import AelfButton from './../../../components/Button/Button'

import moneyKeyboardWrapProps from '../../../utils/moneyKeyboardWrapProps'
import getParam from '../../../utils/getParam' // 还有类似方法的话，合并一下。
import initAelf from '../../../utils/initAelf'
import clipboard from '../../../utils/clipboard'
import getPageContainerStyle from '../../../utils/getPageContainerStyle'

// React component
class TransactionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.aelf = initAelf({
            chainOnly: true
        });
        clipboard('#clipboard-transactionDetail');
    }

    getTxInfo() {
        let txid = getParam('txid',
            hashHistory.getCurrentLocation().search || window.location.href);

        let txInfo = {
            txState: false,
            txResult: null,
            txid: txid
        };
        try {
            if (txid) {
                let result = this.aelf.aelf.chain.getTxResult(txid);

                if (result.error) {
                    txInfo.txResult = result.error;
                } else {
                    txInfo.txResult = result;
                    txInfo.txState = true;
                }
            } else {
                txInfo.txResult = '没有交易id';
            }
        } catch (e) {
            txInfo.txResult = e;
        }
        return txInfo;
    }

    // 如果有地址，则显示icon，如果只是分享，不显示icon
    renderAmount(from, to, amount) {
        let walletInfo = JSON.parse(localStorage.getItem('walletInfoList'));
        let walletList = [];
        for (let each in walletInfo) {
            walletList.push(each);
        }
        let isIn = walletList.indexOf(to) >= 0;
        let isOut = walletList.indexOf(from) >= 0;
        if (isIn && isOut || (!isIn && !isOut)) {
            return <div className={style.list}>
                <div className={style.title}>转账数</div>
                <div className={style.text}>{amount}</div>
            </div>;
        }
        return <div className={style.list + ' ' + style.banner}>
            <div className={style.icon + ' ' + (isIn ? style.in : style.out)}></div>
            <div>
                <div className={style.balance}>{amount}</div>
                {/*<div className={style.tenderValuation}>法币价值【暂无】</div>*/}
            </div>
        </div>;
    }

    renderTransfer(txResult) {
        let { tx_info, tx_status, block_number } = txResult.result;
        let params = tx_info.params && tx_info.params.split(',') || [];
        let to = params[0];
        let amount = params[1];

        let amounHtml = this.renderAmount(tx_info.From, to, amount);

        return <div>
                {amounHtml}

                <div className={style.list}>
                    <div className={style.title}>发款方</div>
                    <div className={style.text}>{tx_info.From}</div>
                </div>
                <div className={style.list}>
                    <div className={style.title}>收款方</div>
                    <div className={style.text}>{to}</div>
                </div>
            </div>;
    }

    renderNotTransfer(txResult) {
        let { tx_info } = txResult.result;
        let method = tx_info.Method;

        return <div>
            <div className={style.list}>
                <div className={style.title}>交易类型</div>
                <div className={style.text}>{method}</div>
            </div>
            <div className={style.list}>
                <div className={style.title}>非转账交易，暂无法解析，以下为交易原始数据</div>
                <div className={style.text}>{JSON.stringify(txResult)}</div>
            </div>
        </div>;
    }

    render() {
        // 这个交易能拿到所有交易，非transfer交易也需要处理。
        let txInfo = this.getTxInfo();

        let { txResult, txid, txState}  = txInfo;

        if (!txState) {
            return (
                <div>
                    <h2>{JSON.stringify(txResult)}</h2>
                </div>
            );
        }

        let { tx_info, tx_status, block_number } = txResult.result;

        let html = this.renderTransfer(txResult);

        let notTransferHtml = '';
        let method = tx_info.Method;
        if (method != 'Transfer') {
            html = '';
            notTransferHtml = this.renderNotTransfer(txResult);
        }

        // 这里有点针对业务定制了。。。233
        let pathname = window.location.pathname;
        let NavHtml = pathname.match(/^\/transactiondetail/) ? '' : <NavNormal navTitle="交易详情"/>;

        let urlForCopy = window.location.host + '/transactiondetail?txid=' + txid;

        let containerStyle = getPageContainerStyle();

        let txInfoContainerStyle = Object.assign({}, containerStyle);
        txInfoContainerStyle.height -= 150;

        return (
            <div>
                {NavHtml}
                <div className={style.container} style={containerStyle}>
                    <div style={txInfoContainerStyle}>
                        <div style={{ wordWrap: 'break-word', lineHeight: 1.5 }}>
                            {html}
                            <div className={style.list}>
                                <div className={style.title}>状态</div>
                                <div className={style.text}>{tx_status}</div>
                            </div>
                            <div className={style.list}>
                                <div className={style.title}>交易Id</div>
                                <div className={style.text}>{tx_info.TxId}</div>
                            </div>
                            <div className={style.list}>
                                <div className={style.title}>区块</div>
                                <div className={style.text}>{block_number}</div>
                            </div>
                            {notTransferHtml}
                        </div>

                    </div>
                    <div className={style.bottom}>
                         <textarea id="copyUrl"
                                   className={style.textarea}
                                   defaultValue={urlForCopy}>
                         </textarea>
                        <button id="clipboard-transactionDetail" data-clipboard-target="#copyUrl" style={{display: 'none'}}>copy</button>
                        <AelfButton
                            onClick={() => {
                                let btn = document.getElementById('clipboard-transactionDetail');
                                btn.click();
                            }}
                        >复制URL</AelfButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransactionDetail