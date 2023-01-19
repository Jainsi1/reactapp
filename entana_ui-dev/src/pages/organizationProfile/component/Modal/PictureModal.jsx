import { Modal, Upload } from "antd"
import React, { useState } from "react";
import ImgCrop from 'antd-img-crop';
import openNotification from "utils/Notification";
import { useMutation } from "@apollo/client";
import { UPDATE_ORGANIZATION_PROFILE_PICTURE } from "./graphql/mutation";
import { GET_ORGANIZATION_PROFILE } from "./graphql/query";

const EditOrganizationProfilePictureModal = ({ visible, closeModal }) => {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [updateOrganizationProfilePicture] = useMutation(UPDATE_ORGANIZATION_PROFILE_PICTURE)

  const handleSubmit = async () => {
    setLoading(true);

    getBase64(file, async (base64) => {
      try {

        const { data } = await updateOrganizationProfilePicture({
          variables: {
            data: { image: base64 }
          },
          refetchQueries: [GET_ORGANIZATION_PROFILE]
        })

        setFile(null);

        if ( !data) throw new Error('Error')

        closeModal();
        setLoading(false);

        openNotification('success', `Profile picture successfully`);

      } catch (error) {
        console.log(error)
        setLoading(false);
        openNotification('error', `Error while updating profile picture`);
      }
    });
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if ( !isJpgOrPng) {
      openNotification("error", 'You can only upload JPG/PNG file!')
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if ( !isLt2M) {
      openNotification("error", 'Image must smaller than 2MB!')
      return false;
    }

    setFile(file);

    getBase64(file, (url) => {
      setImageUrl(url);
    });

    return false
  };

  const [imageUrl, setImageUrl] = useState();

  return (
    <Modal
      title="Edit Profile Picture"
      visible={visible}
      onCancel={closeModal}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Submit"
      centered
    >

      <ImgCrop rotate>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          {imageUrl ? (
            <img
              className="Samsung-Logo"
              style={{
                width: '100%',
              }}
              id="profile-img"
              src={imageUrl}
              alt="Samsung"
            />
          ) : (
            <div
              style={{
                marginTop: 8,
              }}
            >
              Upload
            </div>
          )}
        </Upload>
      </ImgCrop>

    </Modal>
  )
}

export default EditOrganizationProfilePictureModal;