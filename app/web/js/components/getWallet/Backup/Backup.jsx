import React, { Component } from 'react'
import { Modal, Button, WhiteSpace, List, InputItem, Toast } from 'antd-mobile'
import style from './Backup.scss'
import { hashHistory } from 'react-router'

import Mnemonic from './pages/Mnemonic'

import moneyKeyboardWrapProps from '../../../utils/moneyKeyboardWrapProps'
import NavNormal from '../../NavNormal/NavNormal'

import { historyPush } from '../../../utils/historyChange'

import aelf from 'aelf-sdk'

const prompt = Modal.prompt;

// React component
class Backup extends Component {
    constructor() {
        super();
        this.state = {
            privateKey: '',
            // mnemonic: 'grocery jungle body action shop vast toilet fog prevent banner deliver indicate',
            mnemonic: '',
            password: '',
            mnemonicDisplay: false,
            privateKeyModal: false
        };
    }

    showModal(e, key) {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }

    onClose(key) {
        this.setState({
            [key]: false,
        });
    }

    getPrivateKeyAndMnemonic(password = '') {
        password = password || this.state.password;

        let walletId = JSON.parse(localStorage.getItem('lastuse')).address;
        let walletInfoList = JSON.parse(localStorage.getItem('walletInfoList'));
        let walletInfo = walletInfoList[walletId];

        let privateKey = '';
        let mnemonic = '';

        try {
            privateKey = aelf.wallet.AESDecrypto(walletInfo.AESEncryptoPrivateKey, password);
            mnemonic = aelf.wallet.AESDecrypto(walletInfo.AESEncryptoMnemonic, password);
        } catch (e) {
            // 因为封装了一层，解密错误时，转换成utf-8会抛出异常。
            // let string = '[ERROR] Hey guy, your invalid password make the program crash.';
            // privateKey = string;
            // mnemonic = string;
        }

        if (privateKey || mnemonic) {
            this.setState({'privateKey': privateKey});
            this.setState({'mnemonic': mnemonic});
            return true
        } else {
            Toast.fail('密码错误', 1, () => {}, false);
        }
        return false;

    }

    inputPassword(password) {
        this.setState({password: password});
    }

    // 子组件要用，要么this.toggleMnemonic = this.toggleMnemonic.bind(this);
    // 要么在传递是使用箭头函数，比如: onLeftClick={() => this.toggleMnemonic()}
    toggleMnemonic() {
        this.setState({
            mnemonicDisplay: !this.state.mnemonicDisplay
        });
    }

    copyPrivateKey () {
        let id = document.getElementById('privateKeyBackUp');
        id.select();
        document.execCommand("Copy");
        Toast.info('已复制私钥', 1, () => {}, false);
    }

    togglePrivateKey () {

    }

    componentDidUpdate() {
        if (this.state.mnemonicDisplay && !this.state.mnemonic) {
            this.state.mnemonicDisplay = false;
            Toast.fail('该钱包是由私钥导入，无助记词', 2, () => {}, false);
        }
    }
  
    render() {

        let mnemonicHtml = '';
        if (this.state.mnemonic) {
            mnemonicHtml =  <Mnemonic 
                                navTitle="备份助记词" 
                                mnemonic={this.state.mnemonic} 
                                display={this.state.mnemonicDisplay}
                                onLeftClick={() => this.toggleMnemonic()}>
                            </Mnemonic>;
        }

        return (
            <div>

                <NavNormal navTitle="导入钱包" 
                onLeftClick={() => hashHistory.push('/personalcenter/walletManage')}></NavNormal>

                <div className="aelf-white-space"></div>
                <Button onClick={(e) => {
                        // be nullified after the event callback has been invoked,
                        // if dont e.persist(), we can't get e.preventDefault in this.showModal
                        // https://reactjs.org/docs/events.html#event-pooling
                        e.persist();
                        prompt(
                            '密码',
                            '请确保环境安全下备份私钥',
                            [
                                { text: '取消' },
                                { text: '提交', onPress: password => {
                                        let boolean = this.getPrivateKeyAndMnemonic(password);
                                        boolean && this.showModal(e, 'privateKeyModal');
                                    }
                                },
                            ],
                            'secure-text',
                        );
                    }
                }
                >备份私钥</Button>

                <Button onClick={(e) => prompt(
                    '密码',
                    '请确保环境安全下备份助记词',
                    [
                        { text: '取消' },
                        { text: '提交', onPress: password => {
                                let boolean = this.getPrivateKeyAndMnemonic(password);
                                boolean && this.toggleMnemonic();
                            }
                        },
                    ],
                    'secure-text',
                )}
                >备份助记词</Button>

                <Modal
                  visible={this.state.privateKeyModal}
                  transparent
                  maskClosable={false}
                  onClose={() => this.onClose('privateKeyModal')}
                  title="私钥"
                  footer={[
                    {
                        text: '关闭',
                        onPress: () => {
                            this.onClose('privateKeyModal');
                        }
                    }]}
                  wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                  <div style={{ height: 100, wordWrap: 'break-word' }}>
                    {this.state.privateKey}
                    <textarea id="privateKeyBackUp"
                        className={style.textarea}
                        defaultValue={this.state.privateKey}>
                    </textarea>
                    <Button onClick={() => this.copyPrivateKey()}>复制</Button>
                  </div>
                </Modal>
               {mnemonicHtml}
 
                {/*
                <h3 className={style.title}>请确保环境安全下备份助记词和私钥 / Please ensure environmental safety.</h3>

                <List renderHeader={() => '输入密码解密 / Password to decrypto your password and mnemonic.'}>
                    <InputItem
                        value={this.state.password}
                        type="password"
                        placeholder="******"
                        onChange={password => this.inputPassword(password)}
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                    >password</InputItem>
                </List>

                <WhiteSpace />
                <Button onClick={() => this.getPrivateKeyAndMnemonic()}>获取助记词和私钥 / Decrypto</Button>
                <WhiteSpace />

                <div className={style.text}>无法直接复制，需要手抄 / Can not copy directly, you need write it in somewhere.</div>
                <List renderHeader={() => '助记词 / Mnemonic'}>
                    <div className={style.forbidden}>{this.state.mnemonic}</div>
                </List>
                <WhiteSpace />
                <List renderHeader={() => '私钥 / PrivateKey'}>
                    <div className={style.forbidden}>{this.state.privateKey}</div>
                </List>

                <WhiteSpace />
                <WhiteSpace />
                <Button onClick={() => historyPush('/assets')}>返回主页 / Back to home</Button>
                */}
            </div>
        );
    }
}

export default Backup