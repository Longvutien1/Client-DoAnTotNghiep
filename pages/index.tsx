import React, { useState } from 'react';
import {
  AimOutlined,
  BellFilled,
  HomeOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
// import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppSelector } from '@/app/hook';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signout } from '@/features/auth/auth.slice';

const { Content, Sider } = Layout;

const getItem = (label: string, key: string, icon: React.ReactNode, path: string) => ({
  key,
  label,
  icon,
  path
});

const items = [
  getItem("Trang chủ", "home", <Link href="/"> <HomeOutlined /></Link>, "/timDoi"),
  getItem("Cáp kèo, tìm đối", "timDoi", <Link href="/timDoi"> <ThunderboltOutlined /></Link>, "/timDoi"),
  getItem("Bảng xếp hạng", "xepHang", <Link href="/xepHang"> <TrophyOutlined /></Link>, "/xepHang"),
  getItem("Đặt sân", "datSan", <Link href="/datSan"> <AimOutlined /></Link>, "/datSan"),
  getItem("Thông báo", "thongBao", <BellFilled />, "/thongBao"),
  getItem("Đội của tôi", "doiCuaToi", <UserOutlined />, "/doiCuaToi"),
  getItem("Quản lí sân bóng", "manager", <Link href="/manager/quanLiSanBong"> <AimOutlined /></Link>, "/manager")
];


const Home = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  // const [selectedKey, setSelectedKey] = useState("timDoi"); // Lưu key được chọn
  // const handleMenuClick = (e: any) => {
  //   const item = items.find((i) => i.key === e.key);
  //   if (item) {
  //     setSelectedKey(e.key);
  //     // router.push(item.path); // Điều hướng đến route tương ứng
  //   }
  // };

  const handleLogout = () => {
    console.log("Đăng xuất...");
    dispatch(signout())
    toast.success("Đăng xuất thành công!")
    // Xử lý đăng xuất tại đây (xóa token, điều hướng, v.v.)
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const auth = useAppSelector(item => item.auth)

  console.log("auth", auth);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="bg-white">
        <div className="flex items-center justify-center gap-2 py-4">
          <Link href={`/`}>  <img src="/newPts.png" alt="" className="h-12" /></Link>
        </div>
        <div className="flex flex-col h-full">
          <Menu
            theme="light"
            defaultSelectedKeys={["home"]}
            mode="inline"
            items={items}
          />
          {
            auth.value.token !== "" ?
              <Menu
                theme="light"
                defaultSelectedKeys={["login"]}
                mode="inline"
                items={[getItem(` `, "user",
                  <Dropdown overlay={menu} trigger={["click"]} >
                    <div style={{ cursor: "pointer" }} className='gap-2'>
                      <div><Avatar src="/newPts.png" size={20} /></div>
                      <div> {String(auth?.value.user.name)}</div>
                    </div>
                  </Dropdown>, "/timDoi")]}
              />
              :
              <Menu
                theme="light"
                defaultSelectedKeys={["login"]}
                mode="inline"
                items={[getItem("Đăng nhập", "login",
                  <Link href={`/account/login`} className=" font-semibold hover:text-blue-500 hover:cursor-pointer w-full  py-4 ">
                    <div className=''>
                      <LogoutOutlined className="" />
                      <span>Đăng nhập</span>
                    </div>
                  </Link>
                  , "/login")]}
              />

          }

        </div>

      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div>{children}</div>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Home;