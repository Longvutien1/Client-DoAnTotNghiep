import React, { useEffect, useState } from 'react';
import * as Antd from 'antd';
const { List, Badge, Typography, Tabs, Pagination } = Antd;
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getNotifications } from '@/api/notification';
import { Notification } from '@/models/notification';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { RootStateType } from '@/models/type';
import { useSelector } from 'react-redux';
import LayoutHomepage from '@/components/Layout/layoutHomepage';

const { Text } = Typography;
const { TabPane } = Tabs;

// const notifications = [
//   {
//     id: 1,
//     title: 'Chào mừng bạn đến với cộng đồng bóng đá phong trào lớn nhất Việt Nam!',
//     time: '22 ngày trước',
//     status: 'unread',
//   },
//   {
//     id: 2,
//     title: 'Sự kiện bóng đá mới sẽ bắt đầu vào tháng tới!',
//     time: '2 ngày trước',
//     status: 'read',
//   },
//   {
//     id: 3,
//     title: 'Sự kiện bóng đá mới sẽ bắt đầu vào tháng tới!',
//     time: '2 ngày trước',
//     status: 'unread',
//   },
//   {
//     id: 4,
//     title: 'Sự kiện bóng đá mới sẽ bắt đầu vào tháng tới!',
//     time: '2 ngày trước',
//     status: 'read',
//   },
//   {
//     id: 5,
//     title: 'Sự kiện bóng đá mới sẽ bắt đầu vào tháng tới!',
//     time: '2 ngày trước',
//     status: 'read',
//   },
//   // Các thông báo khác...
// ];

interface DataProps {
  data: Notification[]
}

const NotificationPage = ({ data }: DataProps) => {
  const notifications = useSelector((state: RootStateType) => state.notification.value)
  const [filter, setFilter] = useState('all'); // Trạng thái lọc: 'all' (tất cả) hoặc 'unread' (chưa đọc)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeNotification, setActiveNotification] = useState<string>(); // Trạng thái thông báo đang được chọn
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const user = useAppSelector((state) => state.auth.value.user);


  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const data = notifications?.filter((item: Notification) => {
        if (filter === 'all') return true;
        if (filter === 'unread') return item.read === false; // Lọc các thông báo chưa đọc
      });
      // Sắp xếp theo ngày (mới nhất lên đầu)
      const newData2 = [...data].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setFilteredNotifications(newData2);
    }
  }, [user, filter, data]);

  // Hàm thay đổi màu sắc khi click vào thông báo
  const handleNotificationClick = (id: string) => {
    setActiveNotification(id);
  };

  // Hàm để thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Thay đổi trang hiện tại
  };

  // Chuyển đổi giờ UTC sang giờ Việt Nam
  const convertTime = (time: any) => {
    const vietnamTime = new Date(time).toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh', // Múi giờ Việt Nam
      hour12: false // Định dạng 24h
    });
    return vietnamTime
  }

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Thông báo</h1>

      {/* Tùy chọn lọc, chiếm full width */}
      <Tabs activeKey={filter} onChange={setFilter} className="w-full mb-4">
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Chưa đọc" key="unread" />
      </Tabs>

      {/* Danh sách thông báo chiếm toàn bộ chiều rộng */}
      <List
        itemLayout="horizontal"
        dataSource={filteredNotifications.slice((currentPage - 1) * 10, currentPage * 10)} // Lọc dữ liệu theo trang
        renderItem={(item: Notification) => (
          <Link href={`thongBao/${item._id}`}>
            <List.Item
              actions={[<Text type="secondary">{convertTime(item.bookingId?.createdAt)}</Text>]}
              className={`w-full hover:bg-gray-100 py-8 rounded-lg cursor-pointer transition-colors duration-200 
             ${activeNotification === item._id ? 'bg-blue-200' : ''}`} // Thêm màu xanh khi click
              onClick={() => handleNotificationClick(item._id as string)} // Thêm sự kiện click
            >
              <List.Item.Meta
                avatar={<Badge className='pl-4' status={item.read === false ? 'processing' : 'default'} />}
                title={<span className="text-lg font-medium">{item.title}</span>}
                description={item.content}
              />
            </List.Item>
          </Link>
        )}
        className="w-full mb-4"
      />

      {/* Phân trang */}
      {notifications && notifications?.length > 0 &&
        <Pagination
          current={currentPage}
          total={filteredNotifications.length}
          pageSize={10}
          onChange={handlePageChange} // Xử lý sự kiện thay đổi trang
        />
      }
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const data = await getNotifications();
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

NotificationPage.Layout = LayoutHomepage;
export default NotificationPage;
