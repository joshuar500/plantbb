import { Form } from "antd";
import { FormItemProps } from "antd/lib/form";
import * as React from "react";

interface EditableFormItemProps extends FormItemProps {
  readonly editing: boolean;
}

export const EditableFormItem: React.FC<EditableFormItemProps> = (props) => {
  const { editing, ...rest } = props;
  return (
    <Form.Item {...rest}>{editing ? props.children : <Dummy />}</Form.Item>
  );
};

interface DummyProps {
  readonly value?: any;
}

const Dummy: React.FC<DummyProps> = (props) => {
  // const stringValue = typeof props.value === 'string' ? props.value : props.value.toString()
  return <div style={{ paddingLeft: 12 }}>{props.value}</div>;
};
