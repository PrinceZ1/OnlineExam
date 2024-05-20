
var kyThiArray = [];
document.addEventListener("DOMContentLoaded", function () {
    function showForm() {
        document.getElementById("formContainer").style.display = "block";
    }

    // Dữ liệu mẫu


    var token = sessionStorage.getItem('token');

    // Thực hiện yêu cầu fetch đến API
    fetch(`http://localhost:8088/quiz/admin/getAllKyThi`, {
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
            kyThiArray = data.result;
            // Hiển thị danh sách kỳ thi (hoặc thực hiện các hành động khác tùy ý)
            console.log('Danh sách kỳ thi:', kyThiArray);
            // Hiển thị dữ liệu mẫu trong bảng HTML
            var statsBody = document.getElementById("statsBody");
            kyThiArray.forEach(function (data, index) {
                var row = document.createElement("tr");
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.ten}</td>
            <td>${data.soLuongDeThi}</td>
            <td>${data.soLuongDeMo}</td>
            <td>${data.soLuongDeDong}</td>
            <td>
                <button class="btn" onclick="openModal(${data.id})" title="chỉnh sửa"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn" onclick="deleteRow(${data.id})" title="xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
                statsBody.appendChild(row);
            });
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('There has been a problem with your fetch operation:', error);
        });


    window.showForm = showForm;
});

function addKyThi() {
    // Lấy giá trị của trường nhập liệu từ form
    var ten = document.getElementById("tenKyThi").value;

    // Dữ liệu kỳ thi mới
    var body = {
        ten: ten
    };

    // Token từ sessionstore
    var token = sessionStorage.getItem('token');

    const requestOptions = {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token, // Gửi token dưới dạng Bearer Token
            'Content-Type': 'application/json' // Định dạng dữ liệu gửi đi là JSON
        },
        body: JSON.stringify(body)
    };

    // Thực hiện yêu cầu POST đến API để tạo mới kỳ thi
    fetch(`http://localhost:8088/quiz/admin/creatKyThi`, requestOptions)
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error('Không thể tạo kỳ thi mới. Vui lòng thử lại!');
            }
            // Nếu thành công, hiển thị thông báo hoặc thực hiện các hành động khác tùy ý
            console.log('Kỳ thi mới đã được tạo.');
            window.location.reload();
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('xảy ra lỗi:', error);
        });
    return false;
}

function deleteRow(kyThiId) {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    var confirmation = confirm("Bạn có chắc chắn muốn xóa kỳ thi này?");

    // Nếu người dùng xác nhận muốn xóa
    if (confirmation) {
        // Token từ sessionstore
        var token = sessionStorage.getItem('token');

        const requestOptions = {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + token // Gửi token dưới dạng Bearer Token
            }
        };

        // Thực hiện yêu cầu DELETE đến API để xóa kỳ thi
        fetch(`http://localhost:8088/quiz/admin/deleteKyThi/${kyThiId}`, requestOptions)
            .then(response => {
                // Kiểm tra xem yêu cầu có thành công không
                if (!response.ok) {
                    throw new Error('Không thể xóa kỳ thi. Vui lòng thử lại!');
                }
                console.log('kỳ thi đã được xóa.');
                return response.json();
            })
            .then(data => {
                // Hiển thị thông báo từ phản hồi của API
                alert(data.message);
                window.location.reload(); // Reload trang sau khi xóa thành công
            })
            .catch(error => {
                // Xử lý lỗi nếu có
                console.error('Xảy ra lỗi:', error);
            });
    } else {
        // Nếu người dùng chọn hủy, không thực hiện hành động gì
        console.log("Hủy bỏ xóa kỳ thi.");
    }
}



function openModal(id) {
    // Tìm đối tượng trong kyThiArray có id được chỉ định
    var kyThi = kyThiArray.find(item => item.id === id);
    if (!kyThi) {
        console.error('Không tìm thấy mục với id', id, 'trong kyThiArray');
        return;
    }

    // Điền dữ liệu vào modal từ đối tượng kyThi
    document.getElementById('oldtenKyThi').value = kyThi.ten;
    document.getElementById('editModal').style.display = 'block';
    // Thiết lập thuộc tính data-id cho nút lưu thay đổi
    var saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.setAttribute('data-id', id);
    saveChangesButton.onclick = function() {
        saveChanges(id);
    };
}


// Đóng modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveChanges(id) {
    // Lấy giá trị mới của tên kỳ thi từ input
    var id = document.getElementById('saveChangesButton').getAttribute('data-id');
    var ten = document.getElementById('oldtenKyThi').value;

    // Tạo body cho yêu cầu PUT
    var body = {
        ten: ten
    };

    // Token từ sessionstore
    var token = sessionStorage.getItem('token');

    const requestOptions = {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token, // Gửi token dưới dạng Bearer Token
            'Content-Type': 'application/json' // Định dạng dữ liệu gửi đi là JSON
        },
        body: JSON.stringify(body)
    };

    // Thực hiện yêu cầu PUT đến API để cập nhật thông tin kỳ thi
    fetch(`http://localhost:8088/quiz/admin/updateKyThi/${id}`, requestOptions)
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error('Không thể cập nhật kỳ thi. Vui lòng thử lại!');
                
            }
            // Nếu thành công, hiển thị thông báo hoặc thực hiện các hành động khác tùy ý
            console.log('Thông tin kỳ thi đã được cập nhật.');
            closeModal(); // Đóng modal sau khi cập nhật thành công
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('Xảy ra lỗi:', error);
        });
}


