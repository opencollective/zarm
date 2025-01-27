import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropsType from './PropsType';
import Modal from '../modal';
import confirmLocale from './locale/zh_CN';

export interface ConfirmProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class Confirm extends PureComponent<ConfirmProps, {}> {
  static defaultProps = {
    prefixCls: 'za-confirm',
    animationType: 'zoom',
    locale: confirmLocale,
  };

  render() {
    const { prefixCls, className, message, okText, cancelText, onOk, onCancel, locale, ...others } = this.props;
    const cls = classnames(prefixCls, className);
    return (
      <Modal
        className={cls}
        {...others}
        footer={(
          <>
            <div className={`${prefixCls}__button`} onClick={onCancel}>{cancelText || locale!.cancelText}</div>
            <div className={`${prefixCls}__button ${prefixCls}__button--ok`} onClick={onOk}>
              {okText || locale!.okText}
            </div>
          </>
        )}
      >
        {message}
      </Modal>
    );
  }
}
