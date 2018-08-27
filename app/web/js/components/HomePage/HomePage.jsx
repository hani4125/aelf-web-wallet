import React, { Component } from 'react'
import { Drawer, List, NavBar, Icon, WhiteSpace, Toast } from 'antd-mobile';
import { hashHistory } from 'react-router'

import BottomTabBar from '../BottomTabBar/BottomTabBar'

import { historyGoBack, historyReplace } from '../../utils/historyChange'
// import SideBar from './SideBar/SideBar'

// scss 用了css module, 不好覆盖ant的样式。用css部分覆盖ant的样式。
import style from './HomePage.scss'
// pure css without css module.
require('./HomePage.css');

class HomePage extends Component {
  constructor(props) {
    super();
    this.state = {
      open: false,
      walletInUseName: '',
      hidden: true
    };
  }

  onOpenChange() {
    this.setState({ open: !this.state.open });
  }

  siderbarClick(walletInfo) {
    let lastuse = {
        address: walletInfo.address,
        walletName: walletInfo.walletName
    };
    localStorage.setItem('lastuse', JSON.stringify(lastuse));
    this.setState({
      // lastuse: lastuse,
      open: !this.state.open
    });

    // 艹，这代码好恶心。
    let targetPath = `/assets?address=${walletInfo.address}`;
    let notSameWallet = !hashHistory.getCurrentLocation().pathname.match(targetPath);
    if (notSameWallet) {
      // historyReplace(targetPath);
      // setTimeout(() => {
      hashHistory.replace(window.location.hash.replace('#', ''));
      // }, 300);
    }
  }

  // 回头研究一下...放到SideBar.jsx里面去
  getSideBar() {
    // (e) => this.siderbarClick(index, e) react的事件机制
    // https://doc.react-china.org/docs/handling-events.html
    // TODO, 从storage获取数据并拼接。
    let walletInfoList = JSON.parse(localStorage.getItem('walletInfoList'));
    let listItems = [];
    for (let address in walletInfoList) {
      listItems.push(
        (
          <List.Item key={address}
              multipleLine
              onClick={(e) => this.siderbarClick(walletInfoList[address], e)}
            >{walletInfoList[address].walletName}</List.Item>
        )
      );
    }
    listItems.push(
      (
        <List.Item key='getWallet'
            multipleLine
            className='get-wallet'
            onClick={() => hashHistory.push('/get-wallet/guide')}
          > + </List.Item>
      )
    );
    return (
      <List>
        {listItems}
      </List>
    );
  }

  componentDidUpdate() {
    Toast.hide();
  }

  render() {
    // fix in codepen
    const sidebar = this.getSideBar();

    const lastuse = localStorage.getItem('lastuse');
    const walletInUseName = lastuse ? JSON.parse(localStorage.getItem('lastuse')).walletName : '请选择钱包';

    let showLeftClick = true;
    if (hashHistory.getCurrentLocation().pathname.match(/(assets)|(qrcode)|(personalcenter\/home)/)) {
      showLeftClick = false;
    }

    return (
      <div>
        <NavBar icon={showLeftClick ? <Icon type="left" /> : ''} onLeftClick={
          showLeftClick ? 
            () => historyGoBack() : 
            () => {}
        }
          rightContent={[
            <Icon key="1" type="ellipsis" onClick={() => this.onOpenChange()} />,
          ]}
        >{walletInUseName}</NavBar>
        <Drawer
          position="right"
          className='my-drawer'
          style={{ height: document.documentElement.clientHeight - 45 - 22 }}
          enableDragHandle
          contentStyle={{ color: '#A6A6A6', textAlign: 'center' , padding: '11px 0px 50px 0px', overflowX: 'hidden'}}
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={() => this.onOpenChange()}
        >
          {this.props.children}
          
        </Drawer>

        <div className={style.bottomTabBar}>
          <BottomTabBar></BottomTabBar>
        </div>
        
      </div>
      
    );
  }
}

export default HomePage;