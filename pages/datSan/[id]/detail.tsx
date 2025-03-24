import React, { useState } from 'react';
import * as Antd from "antd";
const { Card, Button, Rate, Input, Collapse, List } = Antd; // Import Ant Design components
import * as Icons from '@ant-design/icons';
const { PhoneOutlined, ShareAltOutlined, LikeOutlined, CommentOutlined } = Icons; // Import icons
import Home from '@/pages';
import LayoutHomepage from '@/components/Layout/layoutHomepage';

const { Panel } = Collapse;
const { TextArea } = Input;
interface CommentType {
  user: string,
  content: string,
  date: string
}
const AboutUs = () => {
  const [comment, setComment] = useState<string>(''); // Trạng thái cho bình luận
  const [comments, setComments] = useState<CommentType[]>([]); // Danh sách bình luận

  // Dữ liệu sân bóng
  const stadium = {
    name: 'Sân bóng Quân Đội',
    location: '2 Hoàng Mai, Quận Hai Bà Trưng, Hà Nội',
    imageUrl: 'https://images.unsplash.com/photo-1607558323757-bd5772ab1e56?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwyMDg4OXwwfDF8c2VhY2h8MXx8Y29tcGxldGUlMjBnb2xmfGVufDB8fHx8fDE2Mzc1MzE2NjY&ixlib=rb-1.2.1&q=80&w=1080',
    rating: 4.5,
    phone: '0932 240 797',
    image: 'https://images.unsplash.com/photo-1607558323757-bd5772ab1e56?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwyMDg4OXwwfDF8c2VhY2h8MXx8Y29tcGxldGUlMjBnb2xmfGVufDB8fHx8fDE2Mzc1MzE2NjY&ixlib=rb-1.2.1&q=80&w=1080',
  };

  // Xử lý việc gửi bình luận
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value); // Cập nhật bình luận khi người dùng thay đổi
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, { user: 'Sporta', content: comment, date: '3 tháng trước' }]);
      setComment(''); // Sau khi gửi bình luận thì làm rỗng ô nhập
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-3xl mx-auto text-3xl font-bold mb-4">Chi tiết sân bóng</div>
      <Card
        className="w-full max-w-3xl mx-auto"
        cover={<img alt="stadium" src='https://i.imgur.com/FiGqoO8.jpeg' />}
        actions={[
          <PhoneOutlined key="phone" />,
          // <LocationOutlined key="location" />,
          <ShareAltOutlined key="share" />,
          <LikeOutlined key="like" />,
        ]}
      >
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">{stadium.name}</h2>
          <Rate disabled value={stadium.rating} />
        </div>
        <p className="text-lg text-gray-500">{stadium.location}</p>
        <p className="text-sm text-gray-400">Sân mới</p>
        <div className="flex space-x-4 mt-4">
          <Button icon={<PhoneOutlined />} href={`tel:${stadium.phone}`} className="w-full" type="primary">
            Liên hệ đặt sân : 0988113113
          </Button>
        </div>

        {/* Đánh giá */}
        <Collapse className="mt-4">
          <Panel header="Đánh giá" key="1">
            <div className="text-gray-500">Chưa có đánh giá</div>
          </Panel>
        </Collapse>

        {/* Hình ảnh */}
        <Collapse className="mt-4">
          <Panel header="Hình ảnh" key="2">
            <div className="text-gray-500">Chưa có hình ảnh</div>
          </Panel>
        </Collapse>

        {/* Câu lạc bộ */}
        <Collapse className="mt-4">
          <Panel header="Câu lạc bộ (0)" key="3">
            <div className="text-gray-500">Chưa có đội bóng nào có sân này tại đây</div>
          </Panel>
        </Collapse>
      </Card>

      {/* Bình luận */}
      <div className="mt-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Bình luận</h3>
        <TextArea
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          placeholder="Bình luận của bạn"
          className="mb-4"
        />
        <Button type="primary" onClick={handleCommentSubmit} className="mb-4">
          Gửi bình luận
        </Button>

        {/* Hiển thị các bình luận */}
        <List
          dataSource={comments}
          renderItem={(com) => (
            <List.Item>
              <List.Item.Meta
                title={<a>{com.user}</a>}
                description={com.content}
              />
              <span>{com.date}</span>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

AboutUs.Layout = LayoutHomepage;
export default AboutUs;

