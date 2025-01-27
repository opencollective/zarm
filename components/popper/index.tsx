import React, { HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import PopperJS from 'popper.js';
import classnames from 'classnames';

import ClickOutside from '../click-outside';
import domUtil from '../utils/dom';
import BasePopperProps, { PopperTrigger, PopperPlacement, directionMap } from './PropsType';
import Events from '../utils/events';

export interface PopperProps extends BasePopperProps {
  prefixCls?: string;
  className?: string;
}

interface PopperStates {
  show: boolean;
  direction: PopperPlacement;
  arrowRef: any;
  mounted?: boolean;
  isPending: boolean;
  animationState: 'leave' | 'enter';
}

const invertKeyValues = (obj: object, fn?) => {
  return Object.keys(obj).reduce((acc, key) => {
    const val = fn ? fn(obj[key]) : obj[key];
    acc[val] = acc[val] || [];
    acc[val].push(key);
    return acc as object;
  }, {});
};

const getPopperClientRect = (popperOffsets) => {
  const offsets = { ...popperOffsets };
  offsets.right = offsets.left + offsets.width;
  offsets.bottom = offsets.top + offsets.height;
  return offsets;
};

const customArrowOffsetFn = (data: PopperJS.Data) => {
  const [placement, placement1] = data.placement.split('-');
  const arrow = data.instance.options.modifiers && data.instance.options.modifiers!.arrow!.element as Element;
  const { offsets: { reference } } = data;
  const popper = getPopperClientRect(data.offsets.popper);
  const isVertical = ['left', 'right'].indexOf(placement) !== -1;
  const len = isVertical ? 'height' : 'width';
  const side = isVertical ? 'top' : 'left';
  const altSide = isVertical ? 'left' : 'top';
  const opSide = isVertical ? 'bottom' : 'right';
  const arrowSize = domUtil.getOuterSizes(arrow as HTMLElement)[len];
  const offsetSize = parseFloat(getComputedStyle(data.instance.popper, null).paddingLeft!);
  const hashMap = {
    start: (side === 'top' || side === 'left')
      ? (reference[side] + offsetSize)
      : (reference[opSide] - offsetSize - arrowSize),
    center: reference[side] + reference[len] / 2 - arrowSize / 2,
    end: (side === 'top' || side === 'left')
      ? (reference[opSide] - offsetSize - arrowSize)
      : (reference[side] + offsetSize),
  };
  const place = hashMap[placement1 || 'center'];
  const sideValue = place - popper[side];

  data.arrowElement = arrow!;
  data.arrowStyles[side] = Math.floor(sideValue).toString();
  data.arrowStyles[altSide] = '';

  return data;
};

const popperInstances: Set<PopperJS> = new Set();

class Popper extends React.Component<PopperProps & HTMLAttributes<HTMLDivElement>, PopperStates> {
  static update() {
    popperInstances.forEach((popperInstance) => popperInstance.scheduleUpdate());
  }

  private popper: PopperJS | null;

  private popperNode: HTMLDivElement;

  private reference: HTMLElement;

  private arrowRef: HTMLSpanElement;

  private enterTimer: number;

  private leaveTimer: number;

  static propTypes = {
    prefixCls: PropTypes.string,
    children: PropTypes.element.isRequired,
    visible: PropTypes.bool,
    destroy: PropTypes.bool,
    hasArrow: PropTypes.bool,
    arrowPointAtCenter: PropTypes.bool,
    trigger: PropTypes.oneOf(['click', 'hover', 'focus', 'manual', 'contextMenu']),
    content: PropTypes.node,
    animationType: PropTypes.string,
    animationDuration: PropTypes.number,
    direction: PropTypes.oneOf([
      'top',
      'topLeft',
      'topRight',
      'right',
      'rightTop',
      'rightBottom',
      'bottom',
      'bottomLeft',
      'bottomRight',
      'left',
      'leftTop',
      'leftBottom',
    ]),
    mouseEnterDelay: PropTypes.number,
    mouseLeaveDelay: PropTypes.number,
    onVisibleChange: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'za-popper',
    hasArrow: false,
    destroy: true,
    arrowPointAtCenter: false,
    trigger: /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) ? 'click' : 'hover' as PopperTrigger,
    direction: 'top',
    mouseEnterDelay: 100,
    mouseLeaveDelay: 100,
    visible: false,
    content: '',
    animationType: 'zoom-fade',
    animationDuration: 200,
    onVisibleChange: () => {},
  };

  static getDerivedStateFromProps(props: PopperProps, state: PopperStates) {
    if ('visible' in props && props.trigger === 'manual') {
      return {
        ...state,
        show: props.visible,
        ...(props.visible && { mounted: true }),
      };
    }
    return null;
  }

  state: PopperStates = {
    show: false,
    direction: this.props.direction!,
    arrowRef: null,
    mounted: false,
    isPending: false,
    animationState: 'leave',
  };

  componentDidUpdate(prevProps: PopperProps) {
    const { direction, visible } = this.props;
    if (visible && (prevProps.visible !== visible || prevProps.direction !== direction)) {
      this.handleOpen();
    }
    if (prevProps.visible !== visible && !visible) {
      this.handleClose();
    }
  }

  componentWillUnmount() {
    if (this.popperNode) {
      Events.off(this.popperNode, 'webkitAnimationEnd', this.animationEnd);
      Events.off(this.popperNode, 'animationend', this.animationEnd);
    }
    this.destroy();
    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
  }

  getPopperDomNode() {
    return this.popperNode;
  }

  getContainer() {
    const { getContainer } = this.props;
    if (getContainer) {
      if (typeof getContainer === 'function') {
        return getContainer();
      }
      if (typeof getContainer === 'object' && getContainer instanceof HTMLElement) {
        return getContainer;
      }
    }
    return document.body;
  }

  setTransformOrigin() {
    const placementMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };
    const placement = this.popperNode!.getAttribute('x-placement')!.split('-')[0];
    const origin = placementMap[placement];
    this.popperNode!.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1
      ? `center ${origin}`
      : `${origin} center`;
  }

  handleOpen = () => {
    const { direction, hasArrow, arrowPointAtCenter } = this.props;
    const reference = this.reference as Element;
    const popperNode = this.popperNode as Element;

    if (!popperNode) {
      return;
    }

    if (this.popper) {
      this.destroy();
    }

    this.popper = new PopperJS(reference, popperNode, {
      placement: directionMap[direction!],
      modifiers: {
        preventOverflow: {
          boundariesElement: 'window',
        },
        computeStyle: {
          gpuAcceleration: false,
        },
        arrow: {
          enabled: Boolean(this.arrowRef),
          element: this.arrowRef,
          ...(!(hasArrow && arrowPointAtCenter) && { fn: customArrowOffsetFn }),
        },
      },
      onCreate: this.handlePopperUpdate,
      onUpdate: this.handlePopperUpdate,
    });

    Events.on(this.popperNode, 'webkitAnimationEnd', this.animationEnd);
    Events.on(this.popperNode, 'animationend', this.animationEnd);

    this.enter();

    popperInstances.add(this.popper);
  };

  animationEnd = (e) => {
    e.stopPropagation();

    const { animationState } = this.state;
    const { destroy } = this.props;

    if (animationState === 'leave') {
      this.setState({
        show: false,
        isPending: false,
        ...(destroy && { mounted: false }),
      }, () => {
        this.destroy();
        this.props.onVisibleChange!(false);
      });
    } else {
      // this.setState({ mounted: true });
      this.props.onVisibleChange!(true);
    }
  };

  handlePopperUpdate = (data) => {
    this.setTransformOrigin();
    if (data.placement !== this.state.direction) {
      this.setState({
        direction: invertKeyValues(directionMap)[data.placement],
      });
    }
  };

  handleClose = () => {
    if (!this.popper) {
      return;
    }
    this.leave();
  };

  handleClick = (event) => {
    const { trigger } = this.props;
    const { show } = this.state;

    if (trigger === 'contextMenu') event.preventDefault();
    this.setState({ mounted: true }, () => {
      if (!show) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    });
  };

  handleEnter = (event) => {
    const { children, mouseEnterDelay } = this.props;
    const childrenProps = (children as React.ReactElement<any>).props;

    if (event.type === 'mouseover' && childrenProps.onMouseOver) {
      childrenProps.onMouseOver(event);
    }

    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
    this.enterTimer = setTimeout(() => {
      this.setState({ mounted: true }, this.handleOpen);
    }, mouseEnterDelay);
  };

  handleLeave = (event) => {
    const { children, mouseLeaveDelay } = this.props;
    const childrenProps = (children as React.ReactElement<any>).props;

    if (event.type === 'blur' && childrenProps.onBlur) {
      childrenProps.onBlur(event);
    }

    if (event.type === 'mouseleave' && childrenProps.onMouseLeave) {
      childrenProps.onMouseLeave(event);
    }

    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
    this.leaveTimer = setTimeout(() => {
      this.setState({ mounted: true }, this.handleClose);
    }, mouseLeaveDelay);
  };

  enter() {
    this.setState({
      show: true,
      isPending: true,
      animationState: 'enter',
    });
  }

  leave() {
    this.setState({
      show: false,
      isPending: true,
      animationState: 'leave',
    });
  }

  destroy() {
    if (this.popper) {
      this.popper.destroy();
      popperInstances.delete(this.popper);
      this.popper = null;
    }
  }

  render() {
    const {
      children,
      content,
      prefixCls,
      style,
      className,
      trigger,
      hasArrow,
      animationType,
      animationDuration,
    } = this.props;

    const {
      direction,
      mounted,
      animationState,
      isPending,
    } = this.state;

    const child = <div className={`${prefixCls}__inner`}>{children}</div>;
    const innerCls = classnames(
      className,
      `${prefixCls}__wrapper`,
      `${prefixCls}--${direction}`,
      {
        [`${prefixCls}--hidden`]: animationState === 'leave',
        [`za-${animationType}-${animationState}`]: isPending,
      },
    );
    const childrenProps: React.RefAttributes<any> & React.HTMLAttributes<any> = {
      ref: (node) => { this.reference = node; },
    };
    const event: React.DOMAttributes<HTMLDivElement> = {};
    if (trigger === 'click') {
      childrenProps.onClick = this.handleClick;
    }
    if (trigger === 'contextMenu') {
      childrenProps.onContextMenu = this.handleClick;
    }
    if (trigger === 'hover') {
      childrenProps.onMouseOver = this.handleEnter;
      childrenProps.onMouseLeave = this.handleLeave;
      event.onMouseOver = this.handleEnter;
      event.onMouseLeave = this.handleLeave;
    }
    if (trigger === 'focus') {
      childrenProps.onFocus = this.handleClick;
      // childrenProps.onBlur = this.handleLeave;
    }

    const childElement = React.cloneElement(child, childrenProps);
    const toolTip = (
      <ClickOutside
        onClickOutside={this.handleClose}
        ignoredNode={this.reference}
        className="popper-container"
        disabled={trigger === 'manual'}
      >
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            animationDuration: `${animationDuration}ms`,
          }}
          className={innerCls}
          ref={(node) => { this.popperNode = node!; }}
          {...event}
        >
          <div className={`${prefixCls}__content`}>{content}</div>
          {hasArrow && <span className={`${prefixCls}__arrow`} ref={(el) => { this.arrowRef = el!; }} />}
        </div>
      </ClickOutside>
    );

    return (
      <>
        <div className={prefixCls} style={style}>
          {mounted && createPortal(toolTip, this.getContainer())}
          {childElement}
        </div>
      </>
    );
  }
}

export default Popper;
