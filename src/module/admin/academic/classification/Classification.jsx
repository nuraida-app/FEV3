import { Col, Flex, Row } from "antd";
import Branch from "./branch/Branch";
import Category from "./category/Category";

const Classification = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col sm={24} md={12}>
        <Category />
      </Col>

      <Col sm={24} md={12}>
        <Branch />
      </Col>
    </Row>
  );
};

export default Classification;
