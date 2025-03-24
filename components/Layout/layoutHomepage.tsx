
'use client';
import React, { useEffect, useState } from 'react';
import { AimOutlined, BellOutlined, HomeOutlined, LogoutOutlined, ThunderboltOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { useSelector } from 'react-redux';
import { signout } from '@/features/auth/auth.slice';
import { getListNotificationSlice } from '@/features/notification/notification.slice';
import { RootStateType } from '@/models/type';
import { Breadcrumb, Dropdown, Layout, Menu } from 'antd';

const { Content, Sider } = Layout;

const getItem = (label: string, key: string, icon: React.ReactNode, path: string) => ({
  key,
  label,
  icon,
  path
});

const LayoutHomepage = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector(item => item.auth)
  const notifications = useSelector((state: RootStateType) => state.notification.value)
  console.log("notifications", notifications);

  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    console.log("Đăng xuất...");
    dispatch(signout())
    // Xử lý đăng xuất tại đây (xóa token, điều hướng, v.v.)
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const items = [
    getItem("Trang chủ", "home", <Link href="/"><HomeOutlined /></Link>, "/home"),
    getItem("Cấp kèo, tìm đội", "timDoi", <Link href="/timDoi"><ThunderboltOutlined /></Link>, "/timDoi"),
    getItem("Bảng xếp hạng", "xepHang", <Link href="/xepHang"><TrophyOutlined /></Link>, "/xepHang"),
    getItem("Đặt sân", "datSan", <Link href="/datSan"><AimOutlined /></Link>, "/datSan"),
    getItem(
      "",
      "thongBao",
      <Link href="/thongBao" className="flex items-center">
        <BellOutlined className="" />
        <span className="text-blue-500">Thông báo</span>
        {notifications.length > 0 &&
          <span className="ml-2 text-white bg-red-500 text-xs font-bold rounded-full px-2 py-1">
            {notifications?.filter((item) => !item.read).length}
          </span>
        }

      </Link>,
      "/thongBao"
    ),
    getItem("Đội của tôi", "doiCuaToi", <Link href="/doiCuaToi"><UserOutlined /></Link>, "/doiCuaToi"),
    user.value.user.role === 1 ? getItem("Sân bóng của tôi", "manager", <Link href="/manager/quanLiSanBong"><AimOutlined /></Link>, "/manager") : null,
    getItem("Tạo sân bóng", "myField/add", <Link href="/manager/myField/add"><TrophyOutlined /></Link>, "/myField/add")
  ].filter(Boolean); // Lọc bỏ những phần tử null hoặc undefined

  //   const {
  //     token: { colorBgContainer, borderRadiusLG },
  //   } = theme.useToken();

  useEffect(() => {
    const getData = async () => {
      await dispatch(getListNotificationSlice(user.value.user))
    }
    getData();
  }, [user]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={"15%"} collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ backgroundColor: "white" }} className="bg-white">
        <div className="flex items-center  gap-2 py-4 px-6">
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
            user.isLoggedIn ?
              <Menu
                theme="light"
                defaultSelectedKeys={["login"]}
                mode="inline"
                items={[getItem(` `, "user",
                  <Dropdown overlay={menu} trigger={['click']}>
                    <div className="gap-2">
                      <div>{String(user?.value.user.name)}</div>
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
              //   background: colorBgContainer,
              //   borderRadius: borderRadiusLG,
            }}
          >
            <div>{children}</div>
            {/* <div>trang chủ</div> */}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default LayoutHomepage;