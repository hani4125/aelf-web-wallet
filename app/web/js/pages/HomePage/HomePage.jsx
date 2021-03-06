import React, { Component } from 'react'
import { hashHistory } from 'react-router'

import BottomTabBar from '../BottomTabBar/BottomTabBar'
import NavWithDrawer from '../NavWithDrawer/NavWithDrawer'

// import SideBar from './SideBar/SideBar'

// scss 用了css module, 不好覆盖ant的样式。用css部分覆盖ant的样式。
import style from './HomePage.scss'
// pure css without css module.
require('./HomePage.css');

class HomePage extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div>
        <NavWithDrawer children={this.props.children}/>

        {/* 放到NavWithDrawer中去了，不然fixed定位有问题，抽屉面板无法完全覆盖 */}
        {/*<div className={style.bottomTabBar}>*/}
          {/*<BottomTabBar></BottomTabBar>*/}
        {/*</div>*/}
        
      </div>
      
    );
  }
}

export default HomePage;