import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Input, Radio, Card } from "antd";
import Home from "@/pages";

const paymentMethods = [
  { id: "bank", name: "Chuyển khoản / Internet Banking" },
  { id: "qr", name: "Quét mã QR" },
  { id: "momo", name: "Ví MoMo" },
  { id: "visa", name: "Thẻ Visa, Master, JCB" },
  { id: "atm", name: "Thẻ ATM (Thẻ nội địa)" },
];

const BookingPage = () => {
  const router = useRouter();
  const { id, slotId } = router.query;

  const [selectedPayment, setSelectedPayment] = useState("bank");
  const [fieldData, setFieldData] = useState<any>(null);

  // Giả lập dữ liệu sân từ server
  useEffect(() => {
    if (id && slotId) {
      const mockData = {
        id,
        name: "Sân bóng Quân Đội",
        address: "2 Hoàng Mai, Quận Hai Bà Trưng, Hà Nội",
        slot: {
          id: slotId,
          time: "19:15 - 20:45",
          price: "400K",
        },
      };
      setFieldData(mockData);
    }
    console.log("id: ", id, slotId);
    
  }, [id, slotId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>

      {/* Thông tin đơn hàng */}
      {fieldData && (
        <Card className="mb-4">
          <h3 className="text-lg font-semibold">Tóm tắt đơn hàng</h3>
          <div className="mt-2 border-t pt-2">
            <p><strong>Sân:</strong> {fieldData.name}</p>
            <p><strong>Địa chỉ:</strong> {fieldData.address}</p>
            <p><strong>Giờ đá:</strong> {fieldData.slot.time}</p>
            <p><strong>Giá tiền:</strong> {fieldData.slot.price}</p>
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
        <Input placeholder="Họ và tên" className="mb-2" />
        <Input placeholder="Email" className="mb-2" />
        <Input placeholder="Số điện thoại" className="mb-2" />
      </Card>

      {/* Nút thanh toán */}
      <Button type="primary" block className="mt-4 py-2 text-lg">
        Thanh toán
      </Button>
    </div>
  );
};

BookingPage.Layout = Home;

export default BookingPage;
