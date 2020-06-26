import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useUpdateUserPlantMutation } from "@app/graphql";
import { Button, DatePicker, Form, Input, Popconfirm, Table } from "antd";
import { FormInstance } from "antd/lib/form/util";
import moment from "moment";
import { FieldData } from "rc-field-form/lib/interface";
import * as React from "react";
import { useState } from "react";

import { EditableFormItem } from "./EditableFormItem";

const { Column } = Table;

interface EditablePlantsTableProps {
  readonly plants: FieldData[];
  readonly form: FormInstance;
  readonly add: () => void;
  readonly remove: (index: number) => void;
}

export const EditablePlantsTable: React.FC<EditablePlantsTableProps> = (
  props
) => {
  const { plants, form, add, remove } = props;
  const [editingIndex, setEditingIndex] = useState<number | undefined>(
    undefined
  );
  const [isNewPlant, setNewPlant] = useState<boolean>(false);

  const [updatePlant] = useUpdateUserPlantMutation();

  const addPlant = () => {
    add();
    setEditingIndex(plants.length);
    setNewPlant(true);
  };

  const onSave = (index: number) => {
    form
      .validateFields()
      .then(async (values) => {
        setNewPlant(false);
        setEditingIndex(undefined);

        const plant = values.plants[index];

        console.log("plant", plant);

        const { data } = await updatePlant({
          variables: {
            id: plant.key,
            patch: {
              comment: plant.comment,
              plantName: plant.plantName,
              lastWatered: plant.lastWatered
                ? moment(plant.lastWatered).toISOString()
                : plant.lastWatered,
            },
          },
        });
        console.log("data", data);
      })
      .catch((error) => {
        console.log(error.errorFields);
      });
  };

  const onCancel = (index: number) => {
    if (isNewPlant) {
      remove(index);
    } else {
      form.resetFields([
        ["plants", index, "plantName"],
        ["plants", index, "comment"],
        ["plants", index, "lastWatered"],
      ]);
    }

    setNewPlant(false);
    setEditingIndex(undefined);
  };

  return (
    <Table
      dataSource={plants}
      pagination={false}
      footer={() => (
        <Button onClick={addPlant}>
          <PlusOutlined /> Add Plant
        </Button>
      )}
    >
      <Column
        dataIndex={"plantName"}
        title={"Plant Name"}
        width={125}
        render={(value, row, index) => {
          return (
            <EditableFormItem
              rules={[{ required: true, message: "Plant Name is required" }]}
              name={[index, "plantName"]}
              editing={index === editingIndex}
              className={"ant-form-item-no-bottom-margin"}
            >
              <Input placeholder="plantName" />
            </EditableFormItem>
          );
        }}
      />
      <Column
        dataIndex={"comment"}
        title={"Comment"}
        width={200}
        render={(value, row, index) => {
          return (
            <EditableFormItem
              name={[index, "comment"]}
              editing={index === editingIndex}
              className={"ant-form-item-no-bottom-margin"}
            >
              <Input placeholder="comment" />
            </EditableFormItem>
          );
        }}
      />
      <Column
        dataIndex={"lastWatered"}
        title={"Last Watered"}
        width={200}
        render={(value, row, index) => {
          return (
            // EditableFormItem doesn't support DatePicker
            <Form.Item name={[index, "lastWatered"]} shouldUpdate>
              {index === editingIndex ? (
                <DatePicker />
              ) : (
                <DatePicker disabled />
              )}
            </Form.Item>
          );
        }}
      />
      <Column
        title={"Action"}
        render={(value, row, index) => {
          if (index === editingIndex) {
            return (
              <React.Fragment>
                <Button
                  icon={<SaveOutlined />}
                  shape={"circle"}
                  type={"primary"}
                  style={{ marginRight: 8 }}
                  onClick={() => onSave(index)}
                />
                <Button
                  icon={<CloseOutlined />}
                  shape={"circle"}
                  onClick={() => onCancel(index)}
                />
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment>
                <Button
                  icon={<EditOutlined />}
                  shape={"circle"}
                  style={{ marginRight: 8 }}
                  disabled={editingIndex !== undefined}
                  onClick={() => setEditingIndex(index)}
                />
                <Popconfirm
                  title="Are you sure？"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => remove(index)}
                >
                  <Button
                    icon={<MinusOutlined />}
                    shape={"circle"}
                    type={"danger"}
                    disabled={editingIndex !== undefined}
                  />
                </Popconfirm>
              </React.Fragment>
            );
          }
        }}
      />
    </Table>
  );
};
