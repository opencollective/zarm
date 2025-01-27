import { isArray, isCascader } from '../../utils/validate';

const getValues = (props, defaultValue?: any) => {
  if ('value' in props && props.value && props.value.length > 0) {
    return [].concat(props.value);
  }

  if ('defaultValue' in props && props.defaultValue && props.defaultValue.length > 0) {
    return [].concat(props.defaultValue);
  }

  return defaultValue;
};

const normalState = (props) => {
  const { valueMember, dataSource } = props;
  const value = getValues(props, dataSource!.map((item) => item[0] && item[0][valueMember!]));
  return {
    value,
    objValue: props.dataSource.map((item, index) => item.filter((d) => d[valueMember!] === value[index])[0]),
    dataSource: props.dataSource,
    visible: props.visible || false,
  };
};

const cascaderState = (props) => {
  const { valueMember, cols } = props;
  let newValues = getValues(props, []);
  const newObjValues: any[] = [];
  const newDateSource: any[] = [];

  const parseLevel = ({ level = 0, dataSource }) => {
    newDateSource[level] = dataSource.map((item, index) => {
      const { children, ...others } = item;

      if (
        (newValues[level] && item[valueMember!] === newValues[level]) || (!newValues[level] && index === 0)
      ) {
        newValues[level] = item[valueMember!];
        newObjValues[level] = others;

        if (isArray(children) && children.length > 0 && level + 1 < cols!) {
          parseLevel({
            dataSource: children,
            level: level + 1,
          });
        }
      }

      return others;
    });

    return newValues;
  };

  newValues = parseLevel({ dataSource: props.dataSource });

  return {
    value: newValues,
    objValue: newObjValues,
    dataSource: newDateSource,
    visible: props.visible || false,
  };
};

export default {
  getSource(props) {
    return isCascader(props)
      ? cascaderState(props)
      : normalState(props);
  },
};
