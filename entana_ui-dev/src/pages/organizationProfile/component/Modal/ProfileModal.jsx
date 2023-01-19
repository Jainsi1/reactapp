import { Input, Modal, Form, DatePicker } from "antd"
import React, { useState } from "react";
import openNotification from "utils/Notification";
import { useMutation } from "@apollo/client";
import { UPDATE_ORGANIZATION_PROFILE } from "./graphql/mutation";
import { GET_ORGANIZATION_PROFILE } from "./graphql/query";
import moment from "moment";

const { TextArea } = Input;

const EditOrganizationProfileModal = ({ data, visible, closeModal }) => {

  const {refetch} = data;
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [updateOrganizationProfile] = useMutation(UPDATE_ORGANIZATION_PROFILE)

  const handleRegister = async (values) => {
    setLoading(true);

    try {

      const { data } = await updateOrganizationProfile({
        variables: {
          data: values
        },
        refetchQueries: [GET_ORGANIZATION_PROFILE]
      })

      if ( !data) throw new Error('Error')

      closeModal();
      setLoading(false);

      openNotification('success', `Profile updated successfully`);
      refetch()

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
        <Form.Item
          label="Name"
          name="name"
          className="form-field"
          initialValue={data.name}
          rules={[
            {
              required: true,
              message: "Please input your Company Name",
            },
          ]}
        >
          <Input className="form-input-field" placeholder="Enter your first name"/>
        </Form.Item>
        <Form.Item
          label="Industry"
          name="industry"
          initialValue={data.industry}
          className="form-field"
        >
          <Input className="form-input-field" placeholder="Enter your industry"/>
        </Form.Item>
        <Form.Item
          label="Employees"
          name="employees"
          initialValue={data.employees}
          className="form-field"
        >
          <Input className="form-input-field" placeholder="Enter your employees"/>
        </Form.Item>
        <Form.Item
          label="Founded"
          name="founded"
          initialValue={data.founded ? moment(data.founded) : null}
          className="form-field"
        >
          <DatePicker
            style={{ width: "100%" }}
            picker="year"
            className="form-input-field"
          />
        </Form.Item>
        <Form.Item
          label="HQ"
          name="hq"
          initialValue={data.hq}
          className="form-field"
        >
          <Input className="form-input-field" placeholder="Enter your hq"/>
        </Form.Item>
        <Form.Item
          label="Website"
          name="website"
          initialValue={data.website}
          className="form-field"
        >
          <Input className="form-input-field" placeholder="Enter your website"/>
        </Form.Item>
        <Form.Item
          label="About"
          name="about"
          initialValue={data.about}
          className="form-field"
        >
          <TextArea rows={1} placeholder="Enter your about" maxLength={1000}/>
        </Form.Item>
        <Form.Item
          label="Hash Tag"
          name="hashTag"
          initialValue={data.hashTag}
          className="form-field"
        >
          <TextArea rows={1} placeholder="Enter your Tag" maxLength={1000}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditOrganizationProfileModal;