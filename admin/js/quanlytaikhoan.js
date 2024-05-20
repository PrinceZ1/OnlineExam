// Dữ liệu của sinh viên
var userArray = [];

document.addEventListener('DOMContentLoaded', function() {
    // var statsBody = document.getElementById('statsBody');

    function showFormAddUser() {
        document.getElementById("deThiFormContainer").style.display = "block";
    }

    var token = sessionStorage.getItem('token');

    // Thực hiện yêu cầu fetch đến API
    fetch('http://localhost:8088/quiz/users', {
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
            userArray = data.result;
            // Hiển thị danh sách kỳ thi (hoặc thực hiện các hành động khác tùy ý)
            console.log('Danh sách user:', userArray);
            // Hiển thị dữ liệu mẫu trong bảng HTML
            var statsBody = document.getElementById("statsBody");
            userArray.forEach(function (data, index) {
                var row = document.createElement("tr");
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.fullName}</td>
            <td>${data.username}</td>
            <td>${data.email}</td>
            <td>${data.id}</td>
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


    window.showFormAddUser = showFormAddUser;
});

// Mở modal và hiển thị thông tin cũ của sinh viên
function openModal(id) {
    var user = userArray.find(item => item.id === id);
    if (!user) {
        console.error('Không tìm thấy mục với id', id, 'trong kyThiArray');
        return;
    }

    // Điền dữ liệu vào modal từ đối tượng kyThi
    document.getElementById('oldfullname').value = user.fullName;
    document.getElementById('oldusername').value = user.username;
    document.getElementById('oldemail').value = user.email;
    document.getElementById('olduserID').value = user.id;
    document.getElementById('editModalUser').style.display = 'block';
    // Thiết lập thuộc tính data-id cho nút lưu thay đổi
    var saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.setAttribute('data-id', id);
    saveChangesButton.onclick = function() {
        saveChanges(id);
    };
}

// Đóng modal
function closeModal() {
    document.getElementById('editModalUser').style.display = 'none';
}

// Đóng modal
function closeModallUserForm() {
    document.getElementById('deThiFormContainer').style.display = 'none';
}

function saveChanges(id) {
    // Lấy giá trị mới của tên kỳ thi từ input
    var id = document.getElementById('saveChangesButton').getAttribute('data-id');
    var fullName = document.getElementById('oldfullname').value;
    var email = document.getElementById('oldemail').value;
    var password = document.getElementById('passwordEdit').value;

    // Tạo body cho yêu cầu PUT
    var body = {
        password: password,
        fullName: fullName,
        email: email
    };
    console.log(body);

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
    fetch(`http://localhost:8088/quiz/users/update/${id}`, requestOptions)
        .then(response => {
            // Kiểm tra xem yêu cầu có thành công không
            if (!response.ok) {
                throw new Error('Không thể cập nhật kỳ thi. Vui lòng thử lại!');
                
            }
            // Nếu thành công, hiển thị thông báo hoặc thực hiện các hành động khác tùy ý
            console.log('Thông tin kỳ thi đã được cập nhật.');
            // window.location.reload();
        })
        .then(data =>{
            alert('Lưu thành công')
             window.location.reload();
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('Xảy ra lỗi:', error);
        });
}


function deleteRow(userid) {
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
        fetch(`http://localhost:8088/quiz/users/delete/${userid}`, requestOptions)
            .then(response => {
                // Kiểm tra xem yêu cầu có thành công không
                if (!response.ok) {
                    throw new Error('Không thể xóa kỳ thi. Vui lòng thử lại!');
                }
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
// Bắt sự kiện khi form được submit
document.getElementById("userForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Lấy giá trị từ các trường input trong form
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var fullName = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;

    // Kiểm tra xem tài khoản đã tồn tại hay chưa
    var isExistingUser = userArray.some(user => user.username === username);

    if (isExistingUser) {
        // Tài khoản đã tồn tại, hiển thị thông báo cho người dùng và không thực hiện yêu cầu tạo mới
        alert("Tên đăng nhập này đã tồn tại. Vui lòng chọn một tên đăng nhập khác.");
    } else {
        // Tạo đối tượng chứa dữ liệu để gửi đến API
        var body = {
            username: username,
            password: password,
            fullName: fullName,
            email: email
        };

        var token = sessionStorage.getItem('token');

        const requestOptions = {
            method: "POST",
            headers: {
                // 'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json' // Định dạng dữ liệu gửi đi là JSON
            },
            body: JSON.stringify(body)
        };

        // Gửi request POST đến API
        fetch(`http://localhost:8088/quiz/users/creatUser`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Response from API:", data);
                // Hiển thị thông báo hoặc thực hiện các hành động khác tùy ý sau khi gửi thành công
                alert("Sinh viên mới đã được thêm thành công!");
                window.location.reload(); // Reload trang sau khi thêm sinh viên thành công
            })
            .catch(error => {
                console.error("There has been a problem with your fetch operation:", error);
                // Hiển thị thông báo hoặc xử lý lỗi tùy ý
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            });
    }
});
