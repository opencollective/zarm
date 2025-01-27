# Modal 模态框



## 基本用法
```jsx
import { Modal, Cell, Button, Select } from 'zarm';

class Demo extends React.Component {
  state = {
    modal1: false,
    modal2: false,
    modal3: false,
    modal4: false,
    modal5: false,
    specModal: false,
    animationType: 'fade',
  };

  myRef = React.createRef();

  open = (key) => {
    this.setState({
      [`${key}`]: true,
    });
  }

  close = (key) => {
    this.setState({
      [`${key}`]: false,
    });
  }

  render() {
    const { modal1, modal2, modal3, modal4, modal5, animationType, specModal } = this.state;
    return (
      <>
        <Cell
          description={
            <Button size="xs" onClick={() => this.open('modal1')}>开启</Button>
          }
        >
          普通
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={() => this.open('modal2')}>开启</Button>
          }
        >
          有底部按钮
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={() => this.open('modal3')}>开启</Button>
          }
        >
          遮罩层可关闭
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={() => this.open('modal4')}>开启</Button>
          }
        >
          无头部，无底部
        </Cell>

        <Cell
          title="动画效果"
          description={
            <Button size="xs" onClick={() => this.open('modal5')}>开启</Button>
          }
        >
          <Select
            value={animationType}
            dataSource={[
              { value: 'fade', label: '淡出淡入效果(fade)' },
              { value: 'zoom', label: '缩放效果(zoom)' },
              { value: 'rotate', label: '旋转效果(rotate)' },
              { value: 'door', label: '开关门效果(door)' },
              { value: 'flip', label: '翻转效果(flip)' },
              { value: 'moveUp', label: '移出移入效果(moveUp)' },
              { value: 'moveDown', label: '移出移入效果(moveDown)' },
              { value: 'moveLeft', label: '移出移入效果(moveLeft)' },
              { value: 'moveRight', label: '移出移入效果(moveRight)' },
              { value: 'slideUp', label: '滑出滑入效果(slideUp)' },
              { value: 'slideDown', label: '滑出滑入效果(slideDown)' },
              { value: 'slideLeft', label: '滑出滑入效果(slideLeft)' },
              { value: 'slideRight', label: '滑出滑入效果(slideRight)' },
            ]}
            onOk={(selected) => {
              this.setState({
                animationType: selected.map(item => item.value),
              });
            }}
          />
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={() => this.open('specModal')}>开启</Button>
          }
        >
          挂载到指定dom节点
        </Cell>

        <Modal
          visible={modal1}
          title="标题"
          closable
          onCancel={() => this.close('modal1')}
        >
          模态框内容
        </Modal>

        <Modal
          title="标题"
          visible={modal2}
          closable
          onCancel={() => this.close('modal2')}
          footer={
            <Button
              block
              theme="primary"
              onClick={() => this.close('modal2')}
            >确认</Button>
          }
        >
          模态框内容
        </Modal>

        <Modal
          visible={modal3}
          title="标题"
          maskClosable
          onCancel={() => this.close('modal3')}
        >
          点击遮罩层关闭
        </Modal>

        <Modal
          visible={modal4}
          maskClosable
          onCancel={() => this.close('modal4')}
        >
          无头部，无底部
        </Modal>

        <Modal
          visible={modal5}
          animationType={animationType}
          maskClosable
          onCancel={() => this.close('modal5')}
        >
            <div style={{ height: 100 }}>
              当前使用的动画类型animationType：'{animationType}'
            </div>
        </Modal>

        <Modal
          visible={specModal}
          maskClosable
          onCancel={() => this.close('specModal')}
          getContainer={() => this.myRef.current}
        >
          挂载到指定dom节点
        </Modal>

        <div
          id="test-div"
          style={{ position: 'relative', zIndex: 1 }}
          ref={this.myRef} 
        />
        
      </>
    )
  }
}

ReactDOM.render(<Demo />, mountNode);
```

## 警告框 Alert
```jsx
import { Cell, Button, Alert, Confirm, Modal  } from 'zarm';

class Demo extends React.Component {
  state = {
    alert: false,
    confirm: false,
  };

  toggle = (key) => {
    this.setState({
      [`${key}`]: !this.state[key],
    });
  }

   render() {
    const { alert, confirm } = this.state;

    return (
      <>
        <Cell
          description={
            <Button size="xs" onClick={() => this.toggle('alert')}>开启</Button>
          }
        >
          普通调用
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={
              () => {
                const modal = Modal.alert({
                  title: '静态调用的title',
                  message: '静态调用的body',
                  onCancel: () => {
                    modal.hide();
                  }
                });
            }}>开启</Button>
          }
        >
          静态调用（静态关闭）
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={() => {
                const modal = Modal.alert({
                  title: '静态调用的title',
                  message: '静态调用的body，使用promise关闭',
                  onCancel: () => {
                    return new Promise((resolve, reject) => {
                      resolve();
                      // setTimeout(Math.random() > 0.5 ? resolve : reject, 500);
                    }).catch(() => {
                      window.alert('出错啦，弹窗无法关闭，继续点击试试');
                      return false; // 返回false，可使弹窗无法关闭
                    })
                  }
                });
            }}>开启</Button>
          }
        >
          静态调用（使用promise关闭）
        </Cell>

        <Alert
          shape="radius"
          visible={alert}
          title="警告"
          message="这里是警告信息"
          afterClose={() => { console.log('alert已关闭'); }}
          onCancel={() => this.toggle('alert')}
        />

        <div
          id="test-div"
          style={{ position: 'relative', zIndex: 1 }}
          ref={this.myRef} 
          />
      </>
    )
  }
}

ReactDOM.render(<Demo />, mountNode);
```

## 确认框 Confirm
```jsx
import { Cell, Button, Confirm, Modal  } from 'zarm';

class Demo extends React.Component {
  state = {
    alert: false,
    confirm: false,
  };

  toggle = (key) => {
    this.setState({
      [`${key}`]: !this.state[key],
    });
  }

  render() {
    const { alert, confirm } = this.state;
    return (
      <>
        <Cell
          description={
            <Button size="xs" onClick={() => this.toggle('confirm')}>开启</Button>
          }
        >
          普通调用
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={() => {
              const modal = Modal.confirm({
                title: '确认信息',
                message: '静态调用的body',
                onCancel: () => {
                  console.log('点击cancel');
                },
                onOk: () => {
                  console.log('点击ok');
                }
              });
            }}>开启</Button>
          }
        >
          静态调用（静态关闭）
        </Cell>

        <Cell
          description={
            <Button size="xs" onClick={() => {
              const modal = Modal.confirm({
                title: '静态调用的title',
                message: '静态调用的body，使用promise关闭',
                onCancel: () => {
                  return new Promise((resolve, reject) => {
                    resolve();
                    // setTimeout(Math.random() > 0.5 ? resolve : reject, 500);
                  }).catch(() => {
                    window.alert('出错啦，弹窗无法关闭，继续点击试试');
                    return false; // 返回false，可使弹窗无法关闭
                  })
                }
              });
            }}>开启</Button>
          }
        >
          静态调用（使用promise关闭）
        </Cell>

        <Confirm
          shape="radius"
          visible={confirm}
          title="确认信息"
          message="你确定要这样做吗？"
          onOk={() => {
            window.alert('click ok');
            this.toggle('confirm');
          }}
          onCancel={() => this.toggle('confirm')}
          afterClose={() => { console.log('confirm已关闭'); }}
        />
      </>
    )
  }
}

ReactDOM.render(<Demo />, mountNode);
```


## API

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| shape | string | 'radius' | 形状，可选值 `rect`、`radius` |
| visible | boolean | false | 是否显示 |
| animationType | string | 'fade' | 动画效果，可选值 `fade`, `door`, `flip`, `rotate`, `zoom`,`moveUp`, `moveDown`, `moveLeft`, `moveRight`,`slideUp`, `slideDown`, `slideLeft`, `slideRight` |
| animationDuration | number | 200 | 动画执行时间（单位：毫秒） |
| width | string &#124; number | '70%' | 宽度 |
| mask | boolean | true | 是否展示遮罩层 |
| maskType | string | 'normal' | 遮罩层的类型，可选值 `transparent`, `normal` |
| maskClosable | boolean | false | 是否点击遮罩层时关闭 |
| closable | boolean | false | 右上角是否显示关闭按钮 |
| title | ReactNode | - | 标题 |
| footer | ReactNode | - | 弹窗底部内容 |
| disableBodyScroll | boolean | true | 弹层展示后是否禁止body滚动 |
| destroy | boolean | true | 弹层关闭后是否移除节点 |
| onCancel | () => void | - | 如果maskClosable或closable为true，那么点击遮罩或者右上角关闭按钮会调用此函数 |
| afterOpen | () => void | - | 模态框打开后的回调 |
| afterClose | () => void | - | 模态框关闭后的回调 |
| onMaskClick | () => void | - | 点击遮罩层时触发的回调函数 |
| getContainer | HTMLElement &#124; () => HTMLElement | document.body | 指定 Modal 挂载的 HTML 节点 |

## 静态方法

```js
// 显示警告框，不传onCancel也可关闭，如需做更多操作，参考下方confirm的例子
const alert = Modal.alert({
  title: '静态调用的title',
  message: '静态调用的body',
});

// 显示确认框，若关闭时需要promise，onOk、onCancel均支持promise
const confirm = Modal.confirm({
  title: '静态调用的title',
  message: '静态调用的body，使用promise关闭',
  onOk: () => {
    return fetch.get('xxx.api').then((res) => {
      if(res.code === 0) { 
        return true; // 关闭弹窗
      } else { 
        return false; // 阻止弹窗关闭
      }
    }).catch(...);
  }
});

```

  
| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| title | ReactNode | - | 弹出框的标题 |
| message | ReactNode | - | 弹出框的内容 |
| cancelText | ReactNode | '关闭'(Alert)/'取消'(Confirm) | 取消按钮的内容 |
| okText | ReactNode | '确认' | 确认按钮的内容 |
| onOk | () => void | - | 点击“确认”后的回调函数(Confirm) |
| onCancel | () => void | - | 点击“关闭/取消”后的回调函数 |



