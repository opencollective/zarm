import BasePickerViewProps from '../picker-view/PropsType';
import { Locale } from '../locale-provider/PropsType';

type getContainerFunc = () => HTMLElement;

export default interface BasePickerProps extends BasePickerViewProps {
  visible?: boolean;
  title?: string;
  okText?: string;
  cancelText?: string;
  maskClosable?: boolean;
  disableBodyScroll: boolean;
  destroy: boolean;
  onOk?: (value: Array<{ [key: string]: any }>) => void;
  onCancel?: () => void;
  getContainer?: HTMLElement | getContainerFunc;
  locale?: Locale['Picker'] & Locale['Select'];
}
