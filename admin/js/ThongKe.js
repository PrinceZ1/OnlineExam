var thongKeArray = [];

document.addEventListener("DOMContentLoaded", function () {
    
    const applyFiltersButton = document.getElementById("applyFilters");
    const exportExcelButton = document.getElementById("exportExcel");

    applyFiltersButton.addEventListener("click", function () {
        applyFilters();
    });

    exportExcelButton.addEventListener("click", function () {
        exportExcel();
    });

    var token = sessionStorage.getItem('token');

    fetch(`http://localhost:8088/quiz/admin/thongke`, {
        headers: {
            'Authorization': 'Bearer ' + token // Gửi token dưới dạng Bearer Token
        }
    })
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Nếu thành công, chuyển đổi phản hồi sang dạng JSON
            return response.json();
        })
        .then(data => {
            // Lưu danh sách kỳ thi vào mảng
            thongKeArray = data.result;
            // Hiển thị danh sách kỳ thi (hoặc thực hiện các hành động khác tùy ý)
            console.log('Danh sách kỳ thi:', thongKeArray);
            // Hiển thị dữ liệu mẫu trong bảng HTML
            var statsBody = document.getElementById("statsBody");
            thongKeArray.forEach(function (data, index) {
                var row = document.createElement("tr");
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.tenDeThi}</td>
            <td>${data.tenKyThi}</td>
            <td>${data.tenMonThi}</td>
            <td>${data.trangThai ? 'Mở' : 'Đóng'}</td>
            <td>${data.soNguoiThamGia}</td>
            <td>${isNaN(data.diemTrungBinh) ? 0 : data.diemTrungBinh}</td>


        `;
                statsBody.appendChild(row);

            });
            addDeThiToDatalist();

        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('There has been a problem with your fetch operation:', error);
        });


    fetch('http://localhost:8088/quiz/admin/getAllMonThi', {
        headers: {
            'Authorization': 'Bearer ' + token // Gửi token dưới dạng Bearer Token
        }
    })
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Nếu thành công, chuyển đổi phản hồi sang dạng JSON
            return response.json();
        })
        .then(data => {
            // Lưu danh sách môn thi vào mảng
            monThiArray = data.result;

            // Lấy thẻ select từ DOM
            var selectElement = document.getElementById("optionMonThi");

            // Đặt dữ liệu môn thi cho select
            monThiArray.forEach(function (monThi) {
                var optionElement = document.createElement("option");
                optionElement.value = monThi.tenMon; // Giả sử id của môn thi là giá trị của option
                optionElement.textContent = monThi.tenMon; // Giả sử tenMon là tên môn thi
                selectElement.appendChild(optionElement);
            });
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('There has been a problem with your fetch operation:', error);
        });




    fetch('http://localhost:8088/quiz/admin/getAllKyThi', {
        headers: {
            'Authorization': 'Bearer ' + token // Gửi token dưới dạng Bearer Token
        }
    })
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Nếu thành công, chuyển đổi phản hồi sang dạng JSON
            return response.json();
        })
        .then(data => {
            // Lưu danh sách môn thi vào mảng
            kyThiArray = data.result;

            // Lấy thẻ select từ DOM
            var selectElement = document.getElementById("optionKyThi");

            // Đặt dữ liệu môn thi cho select
            kyThiArray.forEach(function (kyThi) {
                var optionElement = document.createElement("option");
                optionElement.value = kyThi.ten; // Giả sử id của môn thi là giá trị của option
                optionElement.textContent = kyThi.ten; // Giả sử tenMon là tên môn thi
                selectElement.appendChild(optionElement);
            });
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('There has been a problem with your fetch operation:', error);
        });


    // Hiển thị danh sách sinh viên khi trang được tải
    updateStatistics("all", "all", "");

    function applyFilters() {
        const examType = document.getElementById("optionKyThi").value;
        const subjectType = document.getElementById("optionMonThi").value;
        const status = document.getElementById("status").value;
        // Thực hiện logic áp dụng bộ lọc ở đây
        updateStatistics(examType, subjectType, status);
        drawHistogram()
    }

    function updateStatistics(examType, subjectType, status) {
        const statsTableBody = document.getElementById("statsBody");
        statsTableBody.innerHTML = ""; // Xóa nội dung cũ trong bảng
        let filteredData = thongKeArray;
        if (examType !== 'all') {
            filteredData = filteredData.filter(item => item.tenKyThi === examType);
        }
        if (subjectType !== 'all') {
            filteredData = filteredData.filter(item => item.tenMonThi === subjectType);
        }
        if (status !== 'all') {
            const statusValue = status === '1' ? true : false;
            filteredData = filteredData.filter(item => item.trangThai === statusValue);
        }
        
        // Hiển thị dữ liệu mới trong bảng
        filteredData.forEach(function (data, index) {
            var row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${data.tenDeThi}</td>
                <td>${data.tenKyThi}</td>
                <td>${data.tenMonThi}</td>
                <td>${data.trangThai ? 'Mở' : 'Đóng'}</td>
                <td>${data.soNguoiThamGia}</td>
                <td>${isNaN(data.diemTrungBinh) ? 0 : data.diemTrungBinh}</td>
            `;
            statsBody.appendChild(row);
        });
    }

    function calculateCompletionRate(averageScore) {
        const maxScore = 10.0;
        const completionRate = (averageScore / maxScore) * 100;
        return completionRate.toFixed(2) + "%";
    }

    function drawHistogram() {
        const canvas = document.getElementById('myChart');
        const ctx = canvas.getContext('2d');
    
        // Tạo mảng chứa tất cả các điểm trung bình từ thongKeArray
        const scores = thongKeArray.map(item => item.diemTrungBinh);
    
        // Tạo mảng chứa tất cả các số người tham gia từ thongKeArray
        const participationCounts = thongKeArray.map(item => item.soNguoiThamGia);
    
        // Tạo mảng chứa các nhãn trục x tương ứng với điểm trung bình
        const labels = Array.from({ length: 11 }, (_, i) => i.toString());
    
        // Vẽ biểu đồ histogram
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels, // Sử dụng mảng nhãn đã tạo
                datasets: [{
                    label: 'Số người tham gia',
                    data: participationCounts, // Sử dụng mảng số người tham gia
                    backgroundColor: 'rgba(54, 162, 235, 0.5)', // Màu nền của cột
                    borderColor: 'rgba(54, 162, 235, 1)', // Màu viền của cột
                    borderWidth: 1
                },
                {
                    label: 'Điểm trung bình',
                    data: scores, // Sử dụng mảng điểm trung bình
                    backgroundColor: 'rgba(255, 99, 132, 0.5)', // Màu nền của cột
                    borderColor: 'rgba(255, 99, 132, 1)', // Màu viền của cột
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Điểm trung bình'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Số người tham gia / Điểm trung bình'
                        }
                    }
                }
            }
        });
    }
    
    // Xuất danh sách thành tệp Excel
    function exportExcel() {
        const table = document.getElementById("statistics");
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet JS" });
        XLSX.writeFile(wb, "thong_ke.xlsx");
    }
    

});
