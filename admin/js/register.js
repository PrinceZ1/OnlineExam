


// kiem tra dang ky
function validateRegister() {
    // Lấy giá trị của các trường input
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    // Kiểm tra xem các trường input có trống không
    if (username.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
        // Hiển thị thông báo lỗi nếu có trường input nào trống
        alert('Vui lòng điền đầy đủ thông tin đăng ký!');
        return false; // Ngăn chặn gửi form nếu thông tin không hợp lệ
    } else if (password !== confirmPassword) {
        // Hiển thị thông báo lỗi nếu mật khẩu và xác nhận mật khẩu không khớp
        alert('Mật khẩu và xác nhận mật khẩu không khớp!');
        return false; // Ngăn chặn gửi form nếu thông tin không hợp lệ
    } else {
        // Thực hiện các hành động cần thiết cho việc đăng ký
        // Ví dụ: Gửi dữ liệu form đăng ký đến máy chủ
        window.location.href = 'login.html';
        return false;
    }
}

