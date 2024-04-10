import { Button, Modal, Upload } from 'antd';
import { memo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as api from '../../services/userService';
import { imageOnError } from '../../utils/errorImage';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../helper/getBase64';
import Image from 'next/image';

const Avatar = ({ profileImage, userId, mutate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState([]);
  const [previewImage, setPreviewImage] = useState();
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   *
   * @param {*} BeforeUpload
   * @returns boolean
   */
  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg';
    if (!isJpgOrPng) {
      toast.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      toast.error('Image must smaller than 1MB!');
      return false;
    }
    return true;
  };

  /**
   * for update profile image
   * @param {*} param0
   */
  const handleProfileImageChange = async ({ file, fileList }) => {
    try {
      const validate = beforeUpload(file);
      if (!validate) {
        return false;
      }
      setFile(fileList);
      setImage(file);
      const preview = await getBase64(file);
      setPreviewImage(preview);
      setLoading(false);
    } catch (error) {
      setFile([]);
      toast.error('Something went wrong');
    }
  };
  /**
   * for save profile image
   * @param {*} param0
   * @returns
   */
  const saveProfileImage = async () => {
    try {
      setLoading(true);
      toast.loading('Uploading profile picture...');
      const formData = new FormData();
      formData.append('file', image);
      const { data } = await api.uploadProfilePicture(userId, formData);
      if (data && data.status_code === 200) {
        toast.dismiss();
        toast.success('Profile picture updated successfully');
        setLoading(false);

        mutate('/api/user/');
        setIsModalOpen(false);
      } else {
        toast.dismiss();
        toast.error('Something went wrong');
        setLoading(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Unable to update at this moment');
      setLoading(false);
    }
  };

  /**
   * modal open and close
   */
  const profileImageChange = () => {
    setIsModalOpen(true);
    setFile([]);
    setPreviewImage(profileImage && profileImage !== '' ? profileImage : null);
    setLoading(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {profileImage ? (
        <>
          <Image
            src={profileImage || '/icons/male.svg'}
            className="flex-grow-0 flex-shrink-0 w-full h-full rounded-full object-cover "
            alt="profile-image"
            fill
            onClick={profileImageChange}
            onError={imageOnError}
          />
        </>
      ) : (
        <>
          <Image
            src={'/icons/male.svg'}
            className="flex-grow-0 flex-shrink-0 w-full h-full rounded-full object-cover "
            alt="profile-image"
            fill
            onClick={profileImageChange}
            onError={imageOnError}
          />
        </>
      )}
      <Modal
        title="Profile Photo"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <div className="flex items-center justify-between" key={67776676}>
            <div>
              <Upload
                showUploadList={false}
                onChange={handleProfileImageChange}
                fileList={file}
                beforeUpload={() => false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </div>
            <div>
              <Button
                key="back"
                className="bg-red-600 text-white"
                onClick={handleCancel}
              >
                Close
              </Button>
              ,
              <Button
                key="submit"
                type="primary"
                className="bg-blue-500"
                onClick={saveProfileImage}
                disabled={loading}
              >
                Save
              </Button>
            </div>
          </div>,
        ]}
      >
        <div className="w-full flex items-center justify-center  h-[18rem]">
          {previewImage && (
            <LazyLoadImage
              src={previewImage}
              className="flex-grow-0 flex-shrink-0 rounded-full h-full w-full object-cover border-2 border-gray-200 p-1"
              alt="profile-image"
              onError={imageOnError}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
export default memo(Avatar);
