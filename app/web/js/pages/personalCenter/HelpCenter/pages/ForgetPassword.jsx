/*
 * huangzongzhe
 * 2018.08.27
 */
import React, { Component } from 'react'
import NavNormal from '../../../NavNormal/NavNormal'
import style from './pages.scss'
// React component
class ForgetPassword extends Component {
    render() {
        return (
            <div>
                <NavNormal></NavNormal>
                <div className={style.textContainer}>
                    {/*<h2>如何修改密码？忘记密码怎么办？</h2>*/}
                    {/*<h3>修改密码</h3>*/}
                    {/*<p>修改密码可在钱包管理界面，进行密码修改操作。</p>*/}
                    {/*<h3>忘记密码</h3>*/}
                    {/*<p>在去中心化钱包中，所有用户的用户身份验证内容，如交易密码、私钥、助记词等都保存在用户手机本地，并不是保存在中心化服务器中，所以用户如果忘记密码是没有办法通过第三方团队来重置密码的。</p>*/}
                    {/*<p>唯一的解决办法是通过重新导入助记词或者私钥来设置新的密码。</p>*/}
                    {/*<h2>How to change the password? </h2>*/}
                    <h2>Forget the password</h2>
                    <p>In the decentralized wallet, all users'user authentication content, such as transaction password, private key, mnemonic and so on, are stored locally in the user's mobile phone, not in the centralized server, so if the user forgets the password, it is impossible to reset the password through a third-party team.</p>
                    <p>The only solution is to set up new passwords by re importing mnemonic or private keys.</p>
                </div>
            </div>
        );
    }
}

export default ForgetPassword;