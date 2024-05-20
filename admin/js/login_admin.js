// kiem tra dang nhap
function validateLogin_Admin() {
    var username = document.getElementById('name').value;
    var password = document.getElementById('password').value;

    // Kiểm tra mật khẩu
    if (username === 'admin' && password === '123') {
        alert('Đăng nhập thành công!');
        window.location.href = 'TrangDashBoard.html';
        return false;
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        return false;
    }
}


function togglePassword() {
    var passwordInput = document.querySelector('#password');
    var eyeIcon = document.querySelector('#show_hide_password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}