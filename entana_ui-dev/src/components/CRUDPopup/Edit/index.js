import { Col, Row, Form, Input, Button } from "antd";

export default function Edit({ title }) {
  const onFinish = (values) => {};

  return (
    <Form name="basic" layout="vertical" onFinish={onFinish}>
      <h1 style={{ textAlign: "center" }}>{title} </h1>
      <Form.Item
        label="Title"
        name="title"
        className="form-field"
        rules={[
          {
            required: true,
            message: "Please input title",
          },
        ]}
      >
        <Input className="form-input-field" placeholder="Enter Title" />
      </Form.Item>
      <Form.Item
        label="Business Objective"
        name="businessObjective"
        className="form-field"
        rules={[
          {
            required: true,
            message: "Please input Business Objective",
          },
        ]}
      >
        <Input
          className="form-input-field"
          placeholder="Enter Business Objective"
        />
      </Form.Item>
      <Form.Item
        label="Expected Benifits"
        name="expectedBenifits"
        className="form-field"
        rules={[
          {
            required: true,
            message: "Please input Expected Benifits",
          },
        ]}
      >
        <Input
          className="form-input-field"
          placeholder="Enter Expected Benifits"
        />
      </Form.Item>
      <Row gutter={16} className="register-form-field">
        <Col xs={24} md={12}>
          <Form.Item
            label="Lead"
            name="lead"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input your lead",
              },
            ]}
          >
            <Input
              className="form-input-field-name"
              placeholder=" Enter Lead"
            />
          </Form.Item>
        </Col>
        {/* <Col xs={24} md={12}>
          <Form.Item
            label="LOB"
            name="lob"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input your lob",
              },
            ]}
          >
            <Input className="form-input-field-name" placeholder="Enter Lob" />
          </Form.Item>
        </Col> */}
      </Row>

      <Row gutter={16} className="register-form-field">
        <Col xs={24} md={12}>
          <Form.Item
            label="Plan"
            name="plan"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input your plan",
              },
            ]}
          >
            <Input
              className="form-input-field-name"
              placeholder=" Enter Plan"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Current"
            name="current"
            className="form-field"
            rules={[
              {
                required: true,
                message: "Please input  current",
              },
            ]}
          >
            <Input
              className="form-input-field-name"
              placeholder="Enter Current"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button className="login-button" type="primary" htmlType="submit">
          <span className="button-text">Submit</span>
        </Button>
      </Form.Item>
    </Form>
  );
}
