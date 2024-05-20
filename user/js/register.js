


// kiem tra dang ky
function validateRegister() {
    // Lấy giá trị của các trường input
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var fullname = document.getElementById('fullname').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (username.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '' || fullname.trim() === '') {
        alert('Vui lòng điền đầy đủ thông tin đăng ký!');
        return false;
    } else if (password.length < 8) {
        alert('Mật khẩu phải có từ 8 ký tự!');
        return false;
    
    } else if (password !== confirmPassword) {
        alert('Mật khẩu và xác nhận mật khẩu không khớp!');
        return false;
    } else {
        const body = {
            username: username,
            password: password,
            fullName: fullname,
            email: email
        };
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        };

        fetch(`http://localhost:8088/quiz/users/creatUser`, requestOptions)
            .then(response => {
                if (response.status === 400) {
                    throw new Error('Tên đăng nhập đã được sử dụng. Vui lòng đổi tên khác!');
                }
                if (!response.ok) {
                    throw new Error('Đã xảy ra lỗi.');
                }
                return response.json(); // Chuyển đổi phản hồi thành JSON 
            })
            .then(data => {
                window.location.href = '/login/login.html';
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi:', error);
                alert('Đã xảy ra lỗi: ' + error.message);
            });

        return false;
    }
}

