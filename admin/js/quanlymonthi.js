
var monThiArray = [];
document.addEventListener("DOMContentLoaded", function () {
    function showForm() {
        document.getElementById("formContainer").style.display = "block";
    }

    // Dữ liệu mẫu


    var token = sessionStorage.getItem('token');

    // Thực hiện yêu cầu fetch đến API
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
            // Hiển thị danh sách môn thi (hoặc thực hiện các hành động khác tùy ý)
            console.log('Danh sách môn thi:', monThiArray);
            // Hiển thị dữ liệu mẫu trong bảng HTML
            var statsBody = document.getElementById("statsBody");
            monThiArray.forEach(function (data, index) {
                var row = document.createElement("tr");
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.tenMon}</td>
            <td>${data.soLuongDeThi}</td>
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

function addMonThi() {
    // Lấy giá trị của trường nhập liệu từ form
    var tenMon = document.getElementById("tenMon").value;

    // Dữ liệu môn thi mới
    var body = {
        tenMon: tenMon
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

    // Thực hiện yêu cầu POST đến API để tạo mới môn thi
    fetch('http://localhost:8088/quiz/admin/creatMonThi', requestOptions)
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error('Không thể tạo môn thi mới. Vui lòng thử lại!');
            }
            // Nếu thành công, hiển thị thông báo hoặc thực hiện các hành động khác tùy ý
            console.log('Môn thi mới đã được tạo.');
            window.location.reload();
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('xảy ra lỗi:', error);
        });
    return false;
}

function deleteRow(monThiId) {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    var confirmation = confirm("Bạn có chắc chắn muốn xóa môn thi này?");

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

        // Thực hiện yêu cầu DELETE đến API để xóa môn thi
        fetch(`http://localhost:8088/quiz/admin/deleteMonThi/${monThiId}`, requestOptions)
            .then(response => {
                // Kiểm tra xem yêu cầu có thành công không
                if (!response.ok) {
                    throw new Error('Không thể xóa môn thi. Vui lòng thử lại!');
                }
               
                console.log('Môn thi đã được xóa.');
                
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
        console.log("Hủy bỏ xóa môn thi.");
    }
}



function openModal(id) {
    var monThi = monThiArray.find(item => item.id === id);
    if (!monThi) {
        console.error('Không tìm thấy mục với id', id, 'trong monThiArray');
        return;
    }

    document.getElementById('oldtenMon').value = monThi.tenMon;
    document.getElementById('editModal').style.display = 'block';
    // Thiết lập thuộc tính data-id cho nút lưu thay đổi
    var saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.setAttribute('data-id', id);
    saveChangesButton.onclick = function() {
        saveChanges(id);
    };
}


function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveChanges(id) {
    var id = document.getElementById('saveChangesButton').getAttribute('data-id');
    var tenMon = document.getElementById('oldtenMon').value;

    var body = {
        tenMon: tenMon
    };

    var token = sessionStorage.getItem('token');

    const requestOptions = {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(body)
    };


    fetch(`http://localhost:8088/quiz/admin/updateMonThi/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể cập nhật môn thi. Vui lòng thử lại!');
            }
            console.log('Thông tin môn thi đã được cập nhật.');
            closeModal();
        })
        .catch(error => {
            console.error('Xảy ra lỗi:', error);
        });
}


