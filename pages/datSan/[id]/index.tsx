import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import * as Antd from "antd";
const { Card, Tabs, Collapse, Button } = Antd;
import * as Icons from '@ant-design/icons';
const { EnvironmentOutlined, PhoneOutlined } = Icons;
import dayjs, { Dayjs } from "dayjs";
// import viVN from "antd/lib/locale/vi_VN";
import "dayjs/locale/vi"; // Import tiếng Việt cho Day.js
import Link from "next/link";
import Home from "@/pages";
import { GetServerSideProps } from "next";
import { getFootballFieldById } from "@/api/football_fields";
import { FootballField } from "@/models/football_field";
import { getFieldById, getFieldsByIdFootball } from "@/api/field";
import { useDispatch, useSelector } from "react-redux";
import { getFootballFieldByIdUserSlice, getListFootballFieldSlice } from "@/features/footballField/footballField.slice";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { getListFieldsSlice } from "@/features/field/field.slice";
import { Field, TimeSlot } from "@/models/field";
import { getTimeSlot } from "@/api/timeSlot";
import { RootStateType } from "@/models/type";
import LayoutHomepage from "@/components/Layout/layoutHomepage";


// const { TabPane } = Tabs;
// const { Panel } = Collapse;

interface Match {
  id: string;
  timeSlot: string;
  teams: string | null; // Nếu null => sân trống
}

// interface Stadium {
//   id: string;
//   name: string;
//   location: string;
//   phone: string;
//   imageUrl: string;
//   fields: string[];
//   matches: Record<string, Match[]>; // Lịch đấu theo ngày
// }

// interface TimeSlot {
//   id: string;
//   time: string;
//   price: string;
//   isBooked: boolean;
// }

// interface Schedule {
//   date: string;
//   timeSlots: TimeSlot[];
// }

// interface Field {
//   id: string;
//   name: string;
//   schedules: Schedule[];
// }

// Danh sách sân bóng giả lập
// const stadiums: Stadium[] = [
//   {
//     id: "67ce9ea74c79326f98b8bf8e",
//     name: "Sân bóng Long Long",
//     location: "Cầu Giấy, Hà Nội",
//     phone: "0912 345 678",
//     imageUrl: "https://i.imgur.com/FiGqoO8.jpeg",
//     fields: ["Sân 1", "Sân 2", "Sân 3"],
//     matches: {
//       "2024-02-25": [
//         { id: "m1", timeSlot: "7:00 - 8:30", teams: "FC A vs FC B" },
//         { id: "m2", timeSlot: "8:30 - 10:00", teams: null },
//       ],
//     },
//   },
// ];

// Danh sách sân và ca đá trong ngày
const fields = [
  {
    id: "1",
    name: "Sân 1",
    schedules: [
      {
        date: "2025-03-03",
        timeSlots: [
          { id: "1", time: "07:00 - 08:30", price: "200K", isBooked: false },
          { id: "2", time: "08:30 - 10:00", price: "200K", isBooked: true },
          { id: "3", time: "15:15 - 16:45", price: "300K", isBooked: false },
        ]
      },
      {
        date: "2025-03-04",
        timeSlots: [
          { id: "4", time: "17:00 - 18:30", price: "300K", isBooked: true },
          { id: "5", time: "19:15 - 20:45", price: "400K", isBooked: false },
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Sân 2",
    schedules: [
      {
        date: "2025-03-04", timeSlots: [
          { id: "6", time: "08:00 - 09:30", price: "250K", isBooked: false },
          { id: "7", time: "10:00 - 11:30", price: "250K", isBooked: false },
        ]
      }
    ]
  }
];
interface DetailProps {
  data: Field[]
}

const Detail = ({ data }: DetailProps) => {
  const footballField = useSelector((state: RootStateType) => state.footballField.value)
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  console.log("data", data);

  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs()); // Ngày đang chọn
  const [activeField, setActiveField] = useState<string | null>(null); // Sân nào đang mở
  const [selectedDate2, setSelectedDate2] = useState(dayjs().format("D/M"));
  console.log("selectedDate", selectedDate.format("D/M/YYYY"));

  if (!data) return <p className="text-center text-red-500">Không tìm thấy sân bóng</p>;

  dayjs.locale("vi"); // Thiết lập ngôn ngữ cho Dayjs

  // Hàm toggle mở / đóng sân
  const toggleField = (id: string) => {
    setActiveField(activeField === id ? null : id);
  };

  // Hàm chuyển đổi key tab thành định dạng ngày
  const handleDateChange = (key: string) => {
    // Tách giá trị ngày, tháng, năm từ key
    const [day, month, year] = key.split("/").map(Number);
    // Tạo đối tượng dayjs đúng
    const convertedDate = dayjs(`${year}-${month}-${day}`, "YYYY-M-D", true);
    setSelectedDate(convertedDate);
  };

  // Lọc danh sách sân có ca đá trong ngày được chọn
  const filteredFields = data.map((field: any) => {
    const schedule = field.timeSlots.find((s: any) => s.date === selectedDate.format("YYYY-MM-DD"));
    return schedule ? { ...field, timeSlots: schedule.timeSlots } : null;
  }).filter(Boolean) as typeof fields;


  // Chuyển đổi số thứ trong tuần thành dạng đúng của tiếng Việt
  const getVietnameseDay = (dayNumber: number) => {
    if (dayNumber === 0) return "CN"; // Chủ Nhật
    return `Th ${dayNumber + 1}`; // Thứ 2 -> Thứ 7
  };

  // Tạo danh sách 7 ngày tiếp theo
  const dates = Array.from({ length: 30 }, (_, index) => {
    const date = dayjs().add(index, "day");
    return {
      key: date.format("D/M/YYYY"), //2025-03-04
      label: (
        <div className="flex flex-col items-center w-full">
          <div className="text-lg">{date.format("D/M")}</div>
          <div className="text-sm text-gray-500">
            {getVietnameseDay(date.day())}
          </div>
        </div>
      ),
    };
  });

  console.log("data", data);


  return (
    <div className="container mx-auto">
      {/* Chọn ngày */}
      <div className="max-w-4xl mx-auto p-2">
        <Tabs
          defaultActiveKey={selectedDate.format("YYYY-MM-DD")} // Chuyển dayjs thành string
          onChange={(item) => handleDateChange(item)}
          centered // Canh giữa tabs
          items={dates}
          className="bg-blue-50 p-2 px-12 rounded-lg w-full"
          tabBarStyle={{ display: "flex", justifyContent: "space-between" }} // Căng đều tab
          moreIcon={null} // Ẩn icon thừa của Ant Design Tabs
        />
      </div>

      {/* Tabs sân bóng + trận đấu */}
      <Tabs defaultActiveKey="1" className="mt-4 max-w-4xl mx-auto">
        {/* Danh sách sân */}
        <div className="max-w-4xl mx-auto  text-center">
          <h2 className="text-2xl font-bold my-4"> Danh sách sân ({selectedDate.format("DD/MM/YYYY")})</h2>
          {data &&
            <div className="space-y-4">
              {data.map((field: Field, index: number) => (
                <div key={index + 1}>
                  <Button
                    className="w-full text-left border p-2 text-lg font-medium bg-gray-100 hover:bg-gray-200"
                    onClick={() => setActiveField(activeField === field._id ? null : field._id)} disabled={field.status == "Bảo trì" ? true : false}
                  >
                    {field.name} {field.status == "Bảo trì" ? field.status : ""}
                  </Button>

                  {activeField === field._id && (
                    <div className="border p-4 mt-2 bg-white shadow-md rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">{field.name} - Ca đá trong ngày</h3>
                      {/* <div className="grid grid-cols-3 gap-2"> */}
                      {/* {data.map((schedule, index: number) => ( */}
                      <div key={index + 1}>
                        <h4>{selectedDate.format("DD/MM/YYYY")}</h4>
                        <div className="gap-4 w-full text-left">
                          {field.timeSlots && field.timeSlots.length > 0 ?
                            field.timeSlots.map((slot: TimeSlot, index: number) => (

                              <Button key={index} disabled={slot.isBooked && slot.datetime === selectedDate.format("DD/MM/YYYY") ? true : false}
                                className={`border p-2 rounded-md text-center cursor-pointer m-1 ${slot.isBooked && slot.datetime === selectedDate.format("DD/MM/YYYY") ?
                                  "bg-gray-300 text-gray-500 cursor-not-allowed" :
                                  "hover:bg-blue-500 hover:text-white"
                                  }`}
                              >
                                <Link href={`/datSan/${field._id}/${slot._id}?date=${selectedDate.format("DD/MM/YYYY")}`}>
                                  {slot.time}
                                </Link>
                              </Button>
                            ))
                            :
                            <p className="text-center text-gray-500">Không có ca đá nào trong ngày này.</p>
                          }
                        </div>
                      </div>
                    </div>

                  )}
                </div>
              ))}
            </div>
          }
        </div>
      </Tabs>

      <Link href={`/datSan/${footballField._id}/detail`}>
        <Card
          className="w-full mx-auto mt-6 max-w-4xl"
          cover={<img alt="stadium" src={footballField.image} className="w-full h-64 object-cover" />}
        >
          <h2 className="text-2xl font-bold">{footballField.name}</h2>
          <p className="text-gray-500 flex items-center">
            <EnvironmentOutlined className="mr-2" /> {footballField.address}
          </p>
          <p className="text-gray-500 flex items-center">
            <PhoneOutlined className="mr-2" /> {footballField.phone}
          </p>
        </Card>
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  try {
    const id = params?.id as string
    const data = await getFieldsByIdFootball(id);
    console.log("data", data.data);

    return {
      props: {
        data: data.data,
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

Detail.Layout = LayoutHomepage;
export default Detail;   
