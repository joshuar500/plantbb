import { AuthRestrict, Redirect, SharedLayout } from "@app/components";
import {
  CreatedUserPlantFragment,
  useCreateUserPlantMutation,
  useSharedQuery,
} from "@app/graphql";
import {
  extractError,
  formItemLayout,
  getCodeFromError,
  tailFormItemLayout,
} from "@app/lib";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  PageHeader,
  Row,
} from "antd";
import { useForm } from "antd/lib/form/util";
import { ApolloError } from "apollo-client";
import { NextPage } from "next";
import { Store } from "rc-field-form/lib/interface";
import React, { useCallback, useState } from "react";

const CreateUserPlantPage: NextPage = () => {
  const [formError, setFormError] = useState<Error | ApolloError | null>(null);
  const query = useSharedQuery();
  const [form] = useForm();

  const code = getCodeFromError(formError);
  const [plant, setPlant] = useState<null | CreatedUserPlantFragment>(null);
  const [createUserPlant] = useCreateUserPlantMutation();
  const handleSubmit = useCallback(
    async (values: Store) => {
      console.log("values", values);
      setFormError(null);
      try {
        const { plantName, comment, lastWatered } = values;
        console.log("lastWatered", lastWatered);
        const { data } = await createUserPlant({
          variables: {
            plantName,
            comment,
            lastWatered,
          },
        });
        setFormError(null);
        setPlant(data?.createUserPlant?.userPlant || null);
      } catch (e) {
        setFormError(e);
      }
    },
    [createUserPlant]
  );

  if (plant) {
    return <Redirect layout href={`/`} />;
  }

  return (
    <SharedLayout title="" query={query} forbidWhen={AuthRestrict.LOGGED_OUT}>
      <Row>
        <Col flex={1}>
          <PageHeader title="Add Plant" />
          <div>
            <Form {...formItemLayout} form={form} onFinish={handleSubmit}>
              <Form.Item
                label="Plant Name"
                name="plantName"
                rules={[
                  {
                    required: true,
                    message: "Please choose a name for the plant",
                  },
                ]}
              >
                <div>
                  <Input data-cy="createuserplant-input-plantname" />
                </div>
              </Form.Item>
              <Form.Item
                label="Comment"
                name="comment"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <div>
                  <Input data-cy="createuserplant-input-comment" />
                </div>
              </Form.Item>
              <Form.Item
                label="Last Watered"
                name="lastWatered"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <DatePicker data-cy="createuserplant-input-lastwatered" />
              </Form.Item>
              {formError ? (
                <Form.Item {...tailFormItemLayout}>
                  <Alert
                    type="error"
                    message={`Creating user pet failed`}
                    description={
                      <span>
                        {code === "NUNIQ" ? (
                          <span data-cy="createuserplant-alert-nuniq">
                            Something went wrong creating the plant
                          </span>
                        ) : (
                          extractError(formError).message
                        )}
                        {code ? (
                          <span>
                            {" "}
                            (Error code: <code>ERR_{code}</code>)
                          </span>
                        ) : null}
                      </span>
                    }
                  />
                </Form.Item>
              ) : null}
              <Form.Item {...tailFormItemLayout}>
                <Button
                  htmlType="submit"
                  data-cy="createuserplant-button-create"
                >
                  Create
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </SharedLayout>
  );
};

export default CreateUserPlantPage;
