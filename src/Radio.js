// @flow

import * as React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import prefix, { globalKey } from './utils/prefix';
import getUnhandledProps from './utils/getUnhandledProps';
import { partitionHTMLProps } from './utils/htmlPropsUtils';


type Props = {
  id?: string,
  name?: string,
  inline?: boolean,
  title?: string,
  disabled?: boolean,
  checked?: boolean,
  defaultChecked?: boolean,
  inputRef?: React.Ref<any>,
  children?: React.Node,
  className?: string,
  classPrefix?: string,
  value?: any,
  onChange?: (value: any, checked: boolean, event: SyntheticInputEvent<HTMLInputElement>) => void,
  tabIndex?: number
}

type States = {
  checked?: boolean
}


class Radio extends React.Component<Props, States> {
  static displayName = 'Radio';
  static defaultProps = {
    classPrefix: `${globalKey}radio`,
    tabIndex: 0
  };

  constructor(props: Props) {
    super(props);
    const { checked, defaultChecked } = props;
    this.state = {
      checked: _.isUndefined(checked) ? defaultChecked : checked
    };
  }

  updateCheckedState(checked: boolean, callback?: Function) {
    this.setState({ checked }, callback);
  }

  handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { value, disabled, onChange } = this.props;
    const checked = true;
    if (disabled) {
      return;
    }

    this.setState({ checked }, () => {
      onChange && onChange(value, checked, event);
    });

  }
  render() {

    const {
      inline,
      title,
      name,
      className,
      children,
      onChange,
      disabled,
      checked,
      defaultChecked,
      classPrefix,
      tabIndex,
      inputRef,
      ...props,
    } = this.props;

    const nextChecked: boolean | void = _.isUndefined(checked) ? this.state.checked : checked;
    const addPrefix = prefix(classPrefix);
    const classes = classNames(classPrefix, {
      [addPrefix('inline')]: inline,
      [addPrefix('disabled')]: disabled,
      [addPrefix('checked')]: nextChecked
    }, className);

    const unhandled = getUnhandledProps(Radio, props);
    const [htmlInputProps, rest] = partitionHTMLProps(unhandled);


    const input = (
      <span
        className={addPrefix('wrapper')}
        tabIndex={disabled ? -1 : tabIndex}
      >
        <input
          {...htmlInputProps}
          type="radio"
          checked={checked}
          defaultChecked={defaultChecked}
          ref={inputRef}
          name={name}
          disabled={disabled}
          onChange={this.handleChange}
        />
        <span className={addPrefix('inner')} />
      </span>
    );

    return (
      <div
        {...rest}
        className={classes}
      >
        <div
          className={addPrefix('checker')}
          role="button"
        >
          <label title={title}>
            {input}
            {children}
          </label>
        </div>
      </div>
    );
  }

}


export default Radio;
