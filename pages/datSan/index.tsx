/* eslint-disable react-hooks/rules-of-hooks */
import Card from '@/components/Card';
import { AutoComplete, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Home from '..';
import { GetServerSideProps } from 'next';
import { getFootballField } from '@/api/football_fields';
import { FootballField } from '@/models/football_field';

interface CardData {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  verified: boolean;
  rating: number;
}

// const data: CardData[] = [
//   {
//     id: 1,
//     name: 'FC Sao Mai',
//     location: 'Phạm Cự Lượng, Mỹ Phước, Tp Long Xuyên, An Giang',
//     imageUrl: 'https://i.imgur.com/FiGqoO8.jpeg&ixlib=rb-1.2.1&q=80&w=1080',
//     verified: true,
//     rating: 4.5
//   },
//   {
//     id: 2,
//     name: 'Sân bóng Hương Tiến',
//     location: 'Tdp4, phường Nham Biền, Tp Bắc Giang, Bắc Giang',
//     imageUrl: 'https://i.imgur.com/FiGqoO8.jpeg',
//     verified: true,
//     rating: 3.2
//   },
//   {
//     id: 3,
//     name: 'Sân bóng Long long',
//     location: 'Cầu giấy, hà nội',
//     imageUrl: 'https://i.imgur.com/FiGqoO8.jpeg',

//     verified: true,
//     rating: 5
//   },
//   {
//     id: 4,
//     name: 'Sân bóng Phạm hà',
//     location: 'Thanh xuân, hà nội',
//     imageUrl: 'https://i.imgur.com/FiGqoO8.jpeg',

//     verified: true,
//     rating: 1.4
//   },
//   // Add more data as needed
// ];
interface datSanProps {
  data: FootballField[]
}

const datSan = ({ data }: datSanProps) => {
  const [searchValue, setSearchValue] = useState<string>(''); // Dữ liệu cho tìm kiếm
  const [selectedLocation, setSelectedLocation] = useState<string>(''); // Khu vực đã chọn
  const [filteredData, setFilteredData] = useState<FootballField[]>([]); // Dữ liệu lọc the
  console.log("datadatadata",data);
  
  // Lấy tất cả khu vực (location) từ data[]
  const locations = [...new Set(data.map((item:FootballField) => item.address))];

  // Lọc data theo khu vực đã chọn
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value); // Lưu khu vực đã chọn
    const filtered = data.filter((item) =>
      item.address.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); // Cập nhật dữ liệu lọc
  };

  // Lọc dữ liệu theo tên sân bóng (searchValue)
  const handleSearch = (value: string) => {
    setSearchValue(value); // Lưu giá trị tìm kiếm
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered); // Cập nhật dữ liệu lọc
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Lọc dữ liệu khi nhấn Enter
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered); // Cập nhật dữ liệu lọc
    }
  };

  // Sắp xếp dữ liệu theo đánh giá sao (rating) từ cao đến thấp
  useEffect(() => {
    // const sortedData = [...data].sort((a, b) => b._id - a.rating);
    setFilteredData(data); // Hiển thị các sân bóng có rating cao nhất
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Sân bóng</h1>
      <div className="items-center w-full my-4">
        <AutoComplete
          value={selectedLocation}
          onChange={handleLocationChange}
          options={locations
            .filter((location) =>
              location.toLowerCase().includes(selectedLocation.toLowerCase())
            )
            .map((location) => ({
              value: location,
            }))}
          className='w-full mb-2'
        >
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder="Khu vực"
            className="w-full"
          />
        </AutoComplete>

        <AutoComplete
          value={searchValue}
          onChange={handleSearch}
          onKeyDown={handleSearchEnter}
          className='w-full mb-2'
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Nhập tên để tìm"
            className="w-full"
          />
        </AutoComplete>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {filteredData.map((item, index) => (
          <>
            <Link href={`/datSan/${item._id}`}>
              <Card
                key={index + 1}
                name={item.name}
                location={item.address}
                imageUrl={item.image}
                verified={true}
              />
            </Link>
          </>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  try {
    const data = await getFootballField();

    return {
      props: {
        data: data.data
      },
    };
  } catch (error) {
    console.error("Error fetching courts:", error);
    return {
      props: { courts: [] }, // Trả về mảng rỗng nếu có lỗi
    };
  }
}

datSan.Layout = Home;
export default datSan