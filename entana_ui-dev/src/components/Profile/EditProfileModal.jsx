import { Row, Col, Input, Modal, Form } from "antd"
import React, { useState } from "react";
import { GET_PROFILE } from "../../modules/Profile/graphql/query";
import openNotification from "utils/Notification";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "../../modules/Profile/graphql/mutation";

const EditProfileModal = ({ data, visible, closeModal }) => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [updateProfile] = useMutation(UPDATE_PROFILE)

  const handleRegister = async (values) => {
    setLoading(true);

    try {

      const { data } = await updateProfile({
        variables: {
          data: values
        },
        refetchQueries: [GET_PROFILE]
      })

      if ( !data) throw new Error('Error')

      closeModal();
      setLoading(false);

      openNotification('success', `Profile updated successfully`);

    } catch (error) {
      console.log(error)
      setLoading(false);
      openNotification('error', `Error while updating profile`);
    }
  }

  return (
    <Modal
      title="Edit Profile"
      visible={visible}
      onOk={form.submit}
      onCancel={closeModal}
      confirmLoading={loading}
      okText="Submit"
      centered
    >
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={handleRegister}
      >
        <Row>
          <Col md={12} style={{ paddingRight: 6 }}>
            <Form.Item
              label="First Name"
              name="firstName"
              className="form-field"
              initialValue={data.firstName}
              rules={[
                {
                  required: true,
                  message: "Please input your Company Name",
                },
              ]}
            >
              <Input className="form-input-field" placeholder="Enter your first name"/>
            </Form.Item>
          </Col>
          <Col md={12} style={{ paddingLeft: 6 }}>
            <Form.Item
              label="Last Name"
              name="lastName"
              className="form-field"
              initialValue={data.lastName}
              rules={[
                {
                  required: true,
                  message: "Please input your Company Name",
                },
              ]}
            >
              <Input className="form-input-field" placeholder="Enter your last name"/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Industry"
          name="industry"
          initialValue={data.industry}
          className="form-field"
        >
          <Input className="form-input-field" placeholder="Enter your industry"/>
        </Form.Item>
        <Form.Item
          label="Designation"
          name="designation"
          initialValue={data.designation}
          className="form-field"
        >
          <Input className="form-input-field" placeholder="Enter your designation"/>
        </Form.Item>
        <Form.Item
          label="Location"
          name="location"
          initialValue={data.location}
          className="form-field"
        >
          <Input className="form-input-field" placeholder="Enter your location"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditProfileModal;