import { Layout, Menu } from "antd";
import "dayjs/locale/vi";
import Link from "next/link";
import {
    AimOutlined,
    BellFilled,
    HomeOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header, Sider, } = Layout;

const getItem = (label: string, key: string, icon: React.ReactNode, path: string) => ({
    key,
    label,
    icon,
    path
});

// const stadiumMenuData = [
//     {
//         id: "1",
//         name: "Sân 1",
//         time: [
//             { id: 1, time: "19:00 - 20:30" },
//             { id: 2, time: "6:00 - 7:30" },
//             { id: 3, time: "6:00 - 7:30" },
//             { id: 4, time: "6:00 - 7:30" },
//             { id: 5, time: "6:00 - 7:30" },
//         ]
//     },
//     {
//         id: "2",
//         name: "Sân 2",
//         time: [
//             { id: 1, time: "16:00 - 17:30" },
//             { id: 2, time: "9:00 - 7:30" },
//             { id: 3, time: "9:10 - 7:30" },
//             { id: 4, time: "9:20 - 7:30" },
//             { id: 5, time: "9:20 - 7:30" },
//         ]
//     },
// ];
const items = [
    getItem("Trang chủ", "home", <Link href="/"> <HomeOutlined /></Link>, "/timDoi"),
    getItem("Quản lý loại sân", "listField", <Link href="/manager/field"> <ThunderboltOutlined /></Link>, "/listField"),
    getItem("Sân bóng của tôi", "myField", <Link href="/manager/myField"> <ThunderboltOutlined /></Link>, "/myField"),
    getItem("Quản lý sân bóng", "quanLiSanBong", <Link href="/manager/quanLiSanBong"> <TrophyOutlined /></Link>, "/quanLiSanBong"),
    getItem("Quản lý yêu cầu", "datSan", <Link href="/datSan"> <AimOutlined /></Link>, "/datSan"),
    getItem("Thông báo", "thongBao", <BellFilled />, "/thongBao"),
    getItem("Quản lý nhân viên", "doiCuaToi", <UserOutlined />, "/doiCuaToi"),
];

const LayoutManager = ({ children }: { children: React.ReactNode }) => {
    return (
        <Layout className="min-h-screen">
            <Sider width={200} className="bg-gray-900 text-white">
                <div className="p-5 text-lg font-bold">STBall</div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["quanLiSanBong"]}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout>
                <Header className="bg-white shadow-md px-8 ">
                    <div className="my-auto  text-right text-[16px] "><UserOutlined/> Vũ Tiến Long</div>
                </Header>
                {children}
            </Layout>
        </Layout>
    );
}

export default LayoutManager;
