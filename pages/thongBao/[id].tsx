// pages/thongBao/[id].tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Antd from 'antd';
const { Typography, Button } = Antd;
import * as Icons from '@ant-design/icons';
const { ArrowLeftOutlined } = Icons; // Dấu mũi tên quay lại
import Home from '..';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { GetServerSideProps } from 'next';
import { getNotificationsById, updateNotification } from '@/api/notification';
import { Notification } from '@/models/notification';
import { updateNotificationSlice } from '@/features/notification/notification.slice';
import LayoutHomepage from '@/components/Layout/layoutHomepage';

const { Title, Text } = Typography;

interface DataProps {
    data: Notification
}

const fakeNotification = {
    id: 1,
    title: 'Đặt sân bóng thành công!', // Tiêu đề thông báo
    time: '5 phút trước',
    status: 'unread',
    // Nội dung tổng quan thông báo
    content: 'Chúc mừng bạn đã đặt sân thành công! Dưới đây là thông tin về đặt sân',
    // Thông tin chi tiết đặt sân
    details: {
        fieldName: 'Sân bóng Cộng Hòa',
        address: '123 Đường Cộng Hòa, Quận Tân Bình, TP.HCM',
        fieldNumber: 'Sân 1',
        bookingTime: '2025-03-20 08:00 - 10:00',
        price: 500000,
        paymentMethod: 'Chuyển khoản ngân hàng',
        username: 'Long Vu',
        phoneNumber: '0378923745',
        email: 'longvu@example.com',
    },
    // Phần nội dung bên dưới thông báo
    closingMessage: 'Bạn có thể đến sân đúng giờ để trải nghiệm! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.',
};

const NotificationDetailPage = ({ data }: DataProps) => {
    // const user = useAppSelector((state) => state.auth.value.user)
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Giả sử lấy thông báo dựa trên id từ dữ liệu fakeNotification
    const notification = fakeNotification;

    // Quay lại trang trước
    const goBack = () => {
        router.back(); // Quay lại trang trước
    };

    useEffect(() => {
        const update = async () => {
            if (data) {
                const newdata = {
                    ...data,
                    read: true
                }
                await dispatch(updateNotificationSlice(newdata))
            }
        }
        update();
    }, [data])
    return (
        <div className="">
            {/* Dấu mũi tên quay lại */}
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
                className="text-blue-600 mb-2 mx-0 px-0"
            >
                Quay lại
            </Button>

            {/* Tiêu đề thông báo */}
            <h1 className="text-2xl font-semibold mb-4">{data.title || 'Chi tiết thông báo'}</h1>
            {/* Nội dung thông báo */}
            <div className="text-sm text-gray-700 p-4">
                <p className='text-lg font-semibold'>{data.content} </p>
                <br />
                <Text strong>Tên sân: </Text>{data.footballfield?.name}
                <br />
                <Text strong>Địa chỉ: </Text>{data.footballfield?.address}
                <br />
                <Text strong>Số sân: </Text>{data.bookingId.field}
                <br />
                <Text strong>Thời gian đặt: </Text>{data.bookingId.timeStart}
                <br />
                <Text strong>Giá: </Text>{data.bookingId.price} VND
                <br />
                <Text strong>Phương thức thanh toán: </Text>{data.bookingId.payment_method}
                <br />
                <Text strong>Người đặt: </Text>{data.bookingId.username}
                <br />
                <Text strong>Email: </Text>{data.bookingId.email}
                <br />
                <Text strong>Số điện thoại: </Text>{data.bookingId.phoneNumber}
                <br />
                <br />

                {/* Phần nội dung kết thúc thông báo */}
                <Text strong>{notification.closingMessage}</Text>
            </div>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const data = await getNotificationsById(params?.id as string);
        return {
            props: {
                data: data.data,
            },
        };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {
            props: { data: [] }, // Trả về mảng rỗng nếu có lỗi
        };
    }
};

NotificationDetailPage.Layout = LayoutHomepage
export default NotificationDetailPage;
