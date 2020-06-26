import { Col, Row, Typography } from "antd";
import * as React from "react";
const { Title } = Typography;
import { EditablePlantTableForm, SharedLayout } from "@app/components";
import { useSharedQuery } from "@app/graphql";
import { NextPage } from "next";

const Home: NextPage = () => {
  const query = useSharedQuery();
  const { data } = query;

  return (
    <SharedLayout title="" query={query}>
      <Row justify="space-between" gutter={32}>
        <Col xs={24} sm={24}>
          <Title data-cy="homepage-header">Welcome to the Plant Baby</Title>
          {data?.currentUser && (
            <div>
              <EditablePlantTableForm />
              {/* <Table columns={columns} dataSource={plantDataFormatted || []} /> */}
            </div>
          )}
        </Col>
      </Row>
    </SharedLayout>
  );
};

export default Home;
