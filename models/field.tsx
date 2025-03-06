
export interface TimeSlot {
    _id: string;
    time: string;
    price: string;
    isBooked: boolean;
    fieldId: Field | string;
}

export interface Schedule {
    date: string;
}

export interface Field {
    _id: string;
    name: string;
    people: number; // Số người tối đa có thể chơi
    start_time: string; // Giờ mở cửa sân
    end_time: string; // Giờ đóng cửa sân
    status: "Hoạt động" | "Bảo trì"; // Tình trạng sân bóng
    schedules?: Schedule[]; // Không bắt buộc, có thể thêm sau
}







