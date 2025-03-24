import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Antd from 'antd';
const { Button, Input, Radio, Card, Form, notification } = Antd;
import Home from "@/pages";
import { useSelector } from "react-redux";
import { RootStateType } from "@/models/type";
import { Field, TimeSlot } from "@/models/field";
import { FootballField } from "@/models/football_field";
import { createBooking } from "@/api/booking";
import { Booking } from "@/models/booking";
import { toast } from "react-toastify";
import { createNotification } from "@/api/notification";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Notification } from "@/models/notification";
import { GetServerSideProps } from "next";
import { getFieldById, getFieldsByIdFootball } from "@/api/field";
import { getFootballFieldById } from "@/api/football_fields";
import { getTimeSlot, getTimeSlotById } from "@/api/timeSlot";
import { updateTimeSlotSlice } from "@/features/timeSlot/timeSlot.slice";
import { addNotificationSlice } from "@/features/notification/notification.slice";
import LayoutHomepage from "@/components/Layout/layoutHomepage";

const paymentMethods = [
  { id: "bank", name: "Chuyển khoản / Internet Banking" },
  { id: "qr", name: "Quét mã QR" },
  { id: "momo", name: "Ví MoMo" },
  { id: "visa", name: "Thẻ Visa, Master, JCB" },
  { id: "atm", name: "Thẻ ATM (Thẻ nội địa)" },
];

interface FieldData {
  date: string;
  fieldName: string;
  address: string;
  field: string;
  timeStart: string;
  price: number;
  footballFieldId?: FootballField | string;
}

interface Information {
  name: string;
  email: string;
  phone: string
}

interface DataProps {
  fields: Field,
  timeslots: TimeSlot
}

const BookingPage = ({ fields, timeslots }: DataProps) => {
  const footballField = useSelector((state: RootStateType) => state.footballField.value)
  // const fields = useSelector((state: RootStateType) => state.field.value)
  // const timeslots = useSelector((state: RootStateType) => state.timeSlot.value)
  const user = useAppSelector((state) => state.auth.value.user)
  const router = useRouter();
  const { id, slotId, date } = router.query;
  const [form] = Form.useForm();
  const [selectedPayment, setSelectedPayment] = useState("bank");
  const [fieldData, setFieldData] = useState<FieldData | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useAppDispatch();


  const handleSubmit = async (values: Information) => {
    console.log("value", values);
    console.log("selectedPayment", selectedPayment);

    if (fieldData) {
      const newBooking = {
        ...fieldData,
        payment_method: selectedPayment,
        username: values.name,
        email: values.email,
        phoneNumber: values.phone
      }

      const { data } = await createBooking(newBooking);
      if (data) {
        const userNotification: Notification = {
          actor: 'user',
          notificationType: 'field_booked',
          title: 'Đặt sân thành công!',
          content: `Chúc mừng bạn đã đặt sân thành công tại Sân bóng ${data.fieldName}.`,
          bookingId: data._id,
          footballfield: fieldData.footballFieldId,
          targetUser: user._id,
        }
        // Thông tin thông báo cho Manager (quản lý sân)
        const managerNotification: Notification = {
          actor: 'manager',
          notificationType: 'field_booked', // Loại thông báo Sân đã có người đặt
          title: `${data.field} đã có người đặt!`,
          content: `Sân của bạn đã có người đặt vào thời lúc: ${data.timeStart}, ngày ${data.date}.`,
          bookingId: data._id,
          footballfield: fieldData.footballFieldId,
          targetUser: user._id,
        };

        await dispatch(updateTimeSlotSlice({ ...timeslots, isBooked: true, datetime: data.date}))
        await dispatch(addNotificationSlice(userNotification));
        await dispatch(addNotificationSlice(managerNotification));
      
        setIsSuccess(true)
        // Khi người dùng đặt sân thành công, hiển thị thông báo
        notification.success({
          message: 'BẠN ĐÃ ĐẶT SÂN THÀNH CÔNG',
          description: 'Chúc mừng bạn đã đặt sân thành công! Bạn có thể kiểm tra thông tin đặt sân trong trang "Thông báo đặt sân". Cảm ơn bạn đã sử dụng dịch vụ!',
          placement: 'topRight', // Vị trí thông báo
          className: 'bg-green-500 text-white', // Tailwind CSS cho màu nền và văn bản
          duration: 3, // Thời gian hiển thị thông báo
        });
      }
    }

  }
  console.log("fields", fields);

  // Giả lập dữ liệu sân từ server
  useEffect(() => {
    if (id && slotId) {
      // const newField = fields.find((item: Field) => item._id === id);
      // const newTimeslot = timeslots.find((item: TimeSlot) => item._id === slotId);
      if (fields && timeslots) {
        const mockData = {
          date: date as string,
          fieldName: fields.foolballFieldId?.name,
          address: fields.foolballFieldId?.address,
          field: fields.name,
          timeStart: timeslots.time,
          price: Number(timeslots.price),
          footballFieldId: fields.foolballFieldId
        };
        setFieldData(mockData);
      }
    }
  }, [id, slotId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>

        {/* Thông tin đơn hàng */}
        {fieldData && (
          <Card className="mb-4">
            <h3 className="text-lg font-semibold">Tóm tắt đơn hàng</h3>
            <div className="mt-2 border-t pt-2">
              <p><strong>Ngày:</strong> {fieldData.date}</p>
              <p><strong>Tên sân:</strong> {fieldData.fieldName}</p>
              <p><strong>Địa chỉ:</strong> {fieldData.address}</p>
              <p><strong>Sân đá:</strong> {fieldData.field}</p>
              <p><strong>Giờ đá:</strong> {fieldData.timeStart}</p>
              <p><strong>Giá tiền:</strong> {fieldData.price}</p>
            </div>
          </Card>
        )}

        {/* Hình thức thanh toán */}
        <Card className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Hình thức thanh toán</h3>
          <Radio.Group
            className="flex flex-col space-y-2"
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            {paymentMethods.map((method) => (
              <Radio key={method.id} value={method.id}>
                {method.name}
              </Radio>
            ))}
          </Radio.Group>
        </Card>

        {/* Thông tin cá nhân */}
        <Card className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Thông tin cá nhân</h3>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Card>

        {/* Nút thanh toán */}
        <Button type="primary" htmlType="submit" disabled={isSuccess} block className="mt-4 py-2 text-lg">
          Thanh toán
        </Button>
      </Form>

      {isSuccess && (
        <div className="mt-4 p-6 bg-green-100 rounded-lg">
          <p className="text-xl text-green-800">BẠN ĐÃ ĐẶT SÂN THÀNH CÔNG!</p>
          <p className="text-green-600">Thông tin đặt sân đã được lưu. Bạn có thể kiểm tra lại thông tin đặt sân trong phần "Lịch sử".</p>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

  try {
    const id = context.params?.id as string;
    const slotId = context.params?.slotId as string;
    console.log("id, slotId", slotId);

    const data = await getTimeSlotById(slotId);
    const data2 = await getFieldById(id);

    return {
      props: {
        fields: data2.data,
        timeslots: data.data,
        revalidate: 60
      },
    };
  } catch (error) {
    console.error("Error fetching courts:", error);
    return {
      props: { courts: [] }, // Trả về mảng rỗng nếu có lỗi
    };
  }
}

BookingPage.Layout = LayoutHomepage;

export default BookingPage;
