function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Đảm bảo tên đăng nhập và mật khẩu không được để trống
    if (!username || !password) {
        alert('Vui lòng nhập đủ tên đăng nhập và mật khẩu.');
        return false; // Ngăn chặn form được submit
    }

    // Định nghĩa các giá trị username và password cố định
    const fixedUsername = 'admin';
    const fixedPassword = '123';

    // So sánh giá trị nhập vào với giá trị cố định
    if (username === fixedUsername && password === fixedPassword) {
        // Giả sử token và quyền hạn người dùng là cố định
        const fakeToken = 'fake-jwt-token';
        const fakeTokenData = {
            scope: ['ADMIN']
        };

        // Lưu trữ token vào local storage
        sessionStorage.setItem('token', fakeToken);

        // Kiểm tra quyền của người dùng
        if (fakeTokenData.scope.includes('ADMIN')) {
            window.location.href = '/admin/html/TrangDashBoard.html'; // Chuyển hướng đến trang quản trị
        } else {
            window.location.href = '/user/html/home.html'; // Chuyển hướng đến trang người dùng thông thường
        }
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    return false; // Ngăn chặn form được submit
}
