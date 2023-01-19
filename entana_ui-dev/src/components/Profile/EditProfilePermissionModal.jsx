import { Select, Modal, Form } from "antd"
import React, { useState } from "react";
import { GET_PROFILE } from "../../modules/Profile/graphql/query";
import openNotification from "utils/Notification";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE_PERMISSION } from "../../modules/Profile/graphql/mutation";

const { Option } = Select;

const EditProfilePermissionModal = ({ permissions, visible, closeModal }) => {

  const permissionsName = {
    image: 'Image',
    name: 'Name',
    industry: 'Industry',
    organization: 'Organization',
    role: 'Role',
    designation: 'Designation',
    location: 'Location'
  }

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [updateProfilePermission] = useMutation(UPDATE_PROFILE_PERMISSION)

  const handleRegister = async (values) => {
    setLoading(true);

    try {

      const { data } = await updateProfilePermission({
        variables: {
          data: values
        },
        refetchQueries: [GET_PROFILE]
      })

      if ( !data) throw new Error('Error')

      closeModal();
      setLoading(false);

      openNotification('success', `Profile permission updated successfully`);

    } catch (error) {
      console.log(error)
      setLoading(false);
      openNotification('error', `Error while updating profile permission`);
    }
  }

  return (
    <Modal
      title="Edit Profile Permission"
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
        {Object.keys(permissionsName).map(function (key) {
          return (
            <Form.Item
              key={key}
              label={permissionsName[ key ]}
              name={key}
              className="form-field"
              initialValue={permissions?.[ key ] || 'public'}
            >
              <Select>
                <Option value="public">Public</Option>
                <Option value="protected">Protected</Option>
                <Option value="private">Private</Option>
              </Select>
            </Form.Item>
          )
        })}
      </Form>
    </Modal>
  )
}

export default EditProfilePermissionModal;