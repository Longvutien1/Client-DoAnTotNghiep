"use client";
// import { useState } from "react";
import * as Antd from 'antd';
const { Input, Button, Form, Card, Upload } = Antd;
import * as Icons from '@ant-design/icons';
const { UploadOutlined } = Icons;
// import { CldUploadButton } from "next-cloudinary";
import { useAppDispatch, useAppSelector } from "@/app/hook";
// import { addFieldSlice } from "@/features/field/field.slice";
import { addFootBallFieldSlice } from "@/features/footballField/footballField.slice";
import { FootballField } from "@/models/football_field";
import { upload } from "@/utils/upload";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const CreateFieldPage = () => {
  const user = useAppSelector(item => item.auth)
  const router = useRouter();
  console.log("user", user);

  // const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const onFinish = async (values: FootballField) => {
    console.log("values", values);
    const data = await upload(values.image)

    console.log("🎉 Ảnh đã upload thành công:", data);
    const newData = { ...values, image: data, userId: user.value.user._id }
    const newField = await dispatch(addFootBallFieldSlice(newData));
    if (newField) {
      toast.success("Tạo sân bóng thành công");
      router.push("/datSan");
    }
  };


  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.imgur.com/QCTydNo.jpeg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 blur-md"></div>

      <Card className="relative w-3/12 p-6 bg-white bg-opacity-90 shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold text-center mb-4">Tạo Mới Sân Bóng</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Tên Sân" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sân!" }]}>
            <Input placeholder="Nhập tên sân" />
          </Form.Item>

          <Form.Item label="Ảnh Sân" name="image" rules={[{ required: true, message: "Vui lòng tải lên ảnh sân!" }]}>

            {/* <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={handleUpload} // Đảm bảo đúng tên hàm
            >
              <Button type="primary">Upload Ảnh</Button>
            </CldUploadButton>

            {imageUrl && <img src={imageUrl} alt="Uploaded" width="200px" style={{ marginTop: 10 }} />} */}

            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>

          </Form.Item>

          <Form.Item label="Địa chỉ" name="location" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
            <Input placeholder="Nhập địa chỉ sân" />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item label="Chi tiết" name="address">
            <Input.TextArea placeholder="Nhập mô tả chi tiết về sân" rows={3} />
          </Form.Item>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit"  className="w-full">
              {/* {loading ? "Đang tạo..." : "Tạo sân bóng"} */}
              Tạo sân bóng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}


export default CreateFieldPage