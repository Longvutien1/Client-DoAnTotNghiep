/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import * as Antd from "antd";
const { Table, Button, Input, Space, Badge, Modal, Popconfirm, Form } = Antd;
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import LayoutManager from "@/components/Layout/layoutManager";
import { getListFields, removeFieldSlice } from "@/features/field/field.slice";
import { Field, TimeSlot } from "@/models/field";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook";
import { addTimeSlotSlice, getListTimeSlots, removeTimeSlot, removeTimeSlotByFieldId, updateTimeSlotSlice } from "@/features/timeSlot/timeSlot.slice";
import { toast } from "react-toastify";
import Link from "next/link";
import { RootStateType } from "@/models/type";


const ListField = () => {
    const timeSLotData = useSelector((state: RootStateType) => state.timeSlot.value)
    const fieldData = useSelector((state: RootStateType) => state.field.value)
    const [searchText, setSearchText] = useState("");
    const dispath = useAppDispatch();
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();
    const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);

    // delete timeSLot
    const handleDelete = (parentKey: Field, subKey: string, name: string) => {
        if (name === "field") {
            const dele = dispath(removeFieldSlice(subKey));
            const dele2 = dispath(removeTimeSlotByFieldId(subKey));
            toast.success("Xóa thành công!");
        } else if (name === "timeSlot") {
            const dele = dispath(removeTimeSlot(subKey));
            toast.success("Xóa thành công!");
        }


    };

    // Khi bấm Edit, mở modal và truyền dữ liệu cũ
    const handleEditTimeSlot = (timeSlot: TimeSlot) => {
        setEditingTimeSlot(timeSlot);
        setShowModal(true);
    };

    const handleAddTimeSlot = () => {
        setEditingTimeSlot(null); // Xóa dữ liệu cũ
        form.resetFields(); // Reset form ngay lập tức để không giữ giá trị cũ
        setTimeout(() => setShowModal(true), 0); // Đảm bảo state đã cập nhật trước khi mở modal
    };


    // Hàm đóng modal
    const handleClose = () => {
        setEditingTimeSlot(null); // Xóa dữ liệu cũ
        setShowModal(false);
    };

    // Khi submit form
    const handleSubmit = async (fieldId: string) => {
        if (editingTimeSlot) {
            // Cập nhật TimeSlot
            console.log("đã vào edit");
            console.log("editingTimeSlot", editingTimeSlot);
            const values = await form.validateFields();
            console.log("values", values);
            const newTimeSlot = {
                ...editingTimeSlot,
                time: values.time,
                price: values.price
            }
            console.log("newTimeSlot", newTimeSlot);

            // await dispath(updateTimeSlotSlice({ ...values, _id: editingTimeSlot._id }));
            const data = await dispath(updateTimeSlotSlice(newTimeSlot));
            if (data.payload) {
                toast.success("Sửa ca đá thành công!");
                setShowModal(false);
            } else {
                toast.error("Sửa ca đá thất bại, vui lòng thử lại!");
            }
        } else {
            // Thêm TimeSlot mới
            const values = await form.validateFields();
            console.log("values", values);
            const newTimeSlot = {
                ...values,
                isBooked: false,
                fieldId: fieldId
            }
            const data = await dispath(addTimeSlotSlice(newTimeSlot));
            if (data.payload) {
                toast.success("Thêm ca đá thành công!");
                setShowModal(false);
            } else {
                toast.error("Thêm ca đá thất bại, vui lòng thử lại!");
            }
        }
        handleClose();
    };

    useEffect(() => {
        if (!editingTimeSlot) {
            form.resetFields(); // Reset form khi không có TimeSlot
        } else {
            form.setFieldsValue(editingTimeSlot); // Load lại dữ liệu TimeSlot khi sửa
        }
        dispath(getListTimeSlots());
        dispath(getListFields());
    }, [editingTimeSlot]);

    const columns = [
        { title: "#", dataIndex: "key", key: "key" },
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Số người", dataIndex: "people", key: "people" },
        { title: "Bắt đầu lúc", dataIndex: "start_time", key: "start_time" },
        { title: "Kết thúc lúc", dataIndex: "end_time", key: "end_time" },
        {
            title: "Tình trạng",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Badge status="success" text={status} />
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: string, record: Field) => (
                <Space>
                    <Link href={`/manager/field/${record._id}`}> <Button type="primary" icon={<EditOutlined />} /></Link>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        description="Hành động này không thể hoàn tác."
                        onConfirm={() => handleDelete(record, record._id, "field")}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Table con hiển thị lịch đặt sân
    const expandedRowRender = (record: Field) => {
        const dataSource = timeSLotData.filter((item: TimeSlot) => item.fieldId === record._id);
        const subColumns = [
            { title: "Ca ", dataIndex: "time", key: "time" },
            { title: "Gía tiền", dataIndex: "price", key: "price" },
            {
                title: "Hành động",
                key: "action",
                render: (_: string, subRecord: TimeSlot) => (
                    <Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditTimeSlot(subRecord)} />
                        <Popconfirm
                            title="Bạn có chắc muốn xóa?"
                            description="Hành động này không thể hoàn tác."
                            onConfirm={() => handleDelete(record, subRecord._id, "timeSlot")}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                ),
            },
        ];
        return <>
            <Table className="border mb-2" columns={subColumns} dataSource={dataSource || []} pagination={false} />
            <Button type="primary" onClick={handleAddTimeSlot}>Thêm ca đá</Button>

            {/* Modal nhập thông tin ca đá */}
            <Modal
                title={editingTimeSlot ? "Sửa Ca Đá" : "Thêm Ca Đá"}
                visible={showModal}
                onCancel={handleClose}
                onOk={() => handleSubmit(record._id)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Giờ"
                        name="time"
                        rules={[{ required: true, message: "Vui lòng nhập giờ đá!" }]}
                    >
                        <Input placeholder="VD: 12:00 - 13:30" />
                    </Form.Item>

                    <Form.Item
                        label="Giá tiền"
                        name="price"
                        rules={[
                            { required: true, message: "Vui lòng nhập giá tiền!" },
                            { pattern: /^\d+$/, message: "Giá tiền phải là số!" }
                        ]}
                    >
                        <Input placeholder="VD: 150000" />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    };

    const filteredData = fieldData.map((item: Field, index: number) => ({
        ...item,
        key: (index + 1).toString(), // 🛠 Tạo key tự động từ index
    })) || [];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-xl font-semibold mb-4">Quản lý sân bóng</h1>
                <div className="flex justify-between mb-4 ">
                    <Button type="primary" className="bg-green-500">
                        <Link href={'/manager/field/addSan'}>Thêm sân bóng</Link>
                    </Button>
                    <Input
                        placeholder="Tìm kiếm..."
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-64"
                    />
                </div>
                <Table
                    className="border"
                    columns={columns}
                    dataSource={filteredData}
                    expandable={{
                        expandedRowRender, expandIcon: ({ expanded, onExpand, record }) => (
                            <Button type="text" onClick={(e) => onExpand(record, e)}>
                                {expanded ? "▼" : <EyeOutlined />}
                            </Button>
                        )
                    }}
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
};

ListField.Layout = LayoutManager
export default ListField;
