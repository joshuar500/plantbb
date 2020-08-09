import { ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { useUserPlantsQuery } from "@app/graphql";
import { Button, Form, notification, Row } from "antd";
import { useForm } from "antd/lib/form/util";
import moment from "moment";
import * as React from "react";

import { EditablePlantsTable } from "./EditablePlantsTable";

export const EditablePlantTableForm = () => {
  const { data: queryData } = useUserPlantsQuery({
    fetchPolicy: "no-cache",
  });
  // const plantDataFormatted = React.useCallback(() => {
  const formatted =
    queryData?.userPlants &&
    queryData.userPlants.nodes.map((row) => ({
      key: row.id,
      latestPlantImage: row.lastPlantImage,
      plantName: row.plantName,
      comment: row.comment,
      lastWatered: row.lastWatered ? moment(row.lastWatered) : row.lastWatered,
    }));
  const plantData = {
    plantName: "",
    plants: formatted,
  };

  const [form] = useForm();

  const hasNodes = queryData?.userPlants?.nodes.length;

  React.useEffect(() => form.resetFields(), [form, hasNodes]);

  const onFinish = (values: any) => {
    notification.success({
      message: "Submit",
      description: `Received values of form: ${JSON.stringify(values)}`,
    });
  };

  const onReset = () => {
    form.resetFields();
    notification.info({
      message: "Reset",
      description: "Fields reset to original values.",
    });
  };

  return (
    <Form
      form={form}
      name="dynamic_form_item"
      onFinish={onFinish}
      initialValues={plantData}
    >
      {/* TODO: add ability to create lists */}
      {/* <Form.Item name={["plantListName"]} label={"Plant List Name"}>
        <Input placeholder="Please enter a name" style={{ width: "30%" }} />
      </Form.Item> */}
      <Form.List name="plants">
        {(plants, { add, remove }) => (
          <EditablePlantsTable
            form={form}
            plants={plants}
            add={add}
            remove={remove}
          />
        )}
      </Form.List>
      <br />
      <Row>
        <Form.Item>
          <Button type="default" onClick={onReset} icon={<ReloadOutlined />}>
            Reset
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            style={{ marginLeft: 8 }}
          >
            Submit
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
