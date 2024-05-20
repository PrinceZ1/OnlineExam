
var deThiArray = [];
var monThiArray = [];
var kyThiArray = [];
// Mảng để lưu các câu hỏi mới
var newQuestions = [];
document.addEventListener("DOMContentLoaded", function () {
    function showFormDeThi() {
        document.getElementById("deThiFormContainer").style.display = "block";
    }
    var addDeThiCalled = false;
    function showForm() {
        document.getElementById("formContainer").style.display = "block";

    }

    var token = sessionStorage.getItem('token');

    fetch('http://localhost:8088/quiz/admin/getAllDeThi', {
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
            deThiArray = data.result;
            // Hiển thị danh sách kỳ thi (hoặc thực hiện các hành động khác tùy ý)
            console.log('Danh sách kỳ thi:', deThiArray);
            // Hiển thị dữ liệu mẫu trong bảng HTML
            var statsBody = document.getElementById("statsBody");
            deThiArray.forEach(function (data, index) {
                var row = document.createElement("tr");
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.ten}</td>
            <td>${data.tenMonThi}</td>
            <td>${data.tenKyThi}</td>
            <td style="color: ${data.trangThai ? '#21bb3b' : 'red'};"><b>
                ${data.trangThai ? 'Mở' : 'Đóng'}</b>
            </td>
            <td>
                <button class="btn question" onclick="getCauHois('${data.id}')" title="Chi tiết"><b>${data.soCauHoi}</b></button>
            </td>
            <td>${data.thoiGianLamBai}</td>
            <td>${data.lichThi}</td>
            <td>
                <button class="btn " onclick="openModal(${data.id})" title="chỉnh sửa"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn " onclick="deleteRow(${data.id})" title="xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
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
                optionElement.value = monThi.id; // Giả sử id của môn thi là giá trị của option
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
                optionElement.value = kyThi.id; // Giả sử id của môn thi là giá trị của option
                optionElement.textContent = kyThi.ten; // Giả sử tenMon là tên môn thi
                selectElement.appendChild(optionElement);
            });
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            console.error('There has been a problem with your fetch operation:', error);
        });






    // Hàm để thêm câu hỏi vào mảng
    function addQuestion() {
        var ul = document.getElementById("questions");
        var li = document.createElement("li");
        // Tạo một biến để lưu số câu hỏi đã được thêm
        var questionNumber = ul.children.length + 1;

        li.className = "addCauHoi";
        li.innerHTML = `
            <p>Câu hỏi ${questionNumber}</p>
            <textarea class="textAddCauHoi" name="question" placeholder="Đề bài"></textarea>
            <textarea class="textAddCauHoi" name="answerA" placeholder="Đáp án A"></textarea>
            <textarea class="textAddCauHoi" name="answerB" placeholder="Đáp án B"></textarea>
            <textarea class="textAddCauHoi" name="answerC" placeholder="Đáp án C"></textarea>
            <textarea class="textAddCauHoi" name="answerD" placeholder="Đáp án D"></textarea>
            <label>Đáp án đúng:</label>
            <select name="correctAnswer">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
            </select>
            <button class="btn" type="button" onclick="removeQuestion(this)">Xóa</button>
        `;
        ul.appendChild(li);
    }



    function removeQuestion(button) {
        var li = button.parentElement;
        li.parentElement.removeChild(li);
    }

    function importFromExcel() {
        var input = document.createElement('input');
        input.type = 'file';

        input.onchange = function (event) {
            var file = event.target.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                var data = new Uint8Array(event.target.result);
                var workbook = XLSX.read(data, { type: 'array' });
                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                var jsonData = XLSX.utils.sheet_to_json(sheet);

                // Hiển thị dữ liệu hoặc xử lý dữ liệu ở đây
                handleExcelData(jsonData);
            };

            reader.readAsArrayBuffer(file);
        };

        input.click();
    }

    function handleExcelData(data) {
        var ul = document.getElementById("questions");
        var questionNumber = 0;
        data.forEach(function (row) {
            questionNumber++;
            var li = document.createElement("li");
            li.className = "addCauHoi";
            li.innerHTML = `
            <p><b>Câu hỏi ${questionNumber}</b></p>
                <textarea class="textAddCauHoi" name="question" placeholder="Câu hỏi">${row["Đề bài"]}</textarea>
                <textarea class="textAddCauHoi" name="answerA" placeholder="Đáp án A">${row["Đáp án A"]}</textarea>
                <textarea class="textAddCauHoi" name="answerB" placeholder="Đáp án B">${row["Đáp án B"]}</textarea>
                <textarea class="textAddCauHoi" name="answerC" placeholder="Đáp án C">${row["Đáp án C"]}</textarea>
                <textarea class="textAddCauHoi" name="answerD" placeholder="Đáp án D">${row["Đáp án D"]}</textarea>
                <label>Đáp án đúng:</label>
                <select name="correctAnswer">
                    <option value="a" ${row["Đáp án đúng"] === "A" ? "selected" : ""}>A</option>
                    <option value="b" ${row["Đáp án đúng"] === "B" ? "selected" : ""}>B</option>
                    <option value="c" ${row["Đáp án đúng"] === "C" ? "selected" : ""}>C</option>
                    <option value="d" ${row["Đáp án đúng"] === "D" ? "selected" : ""}>D</option>
                </select>
                
                <button class="btn" type="button" onclick="removeQuestion(this)">Xóa</button>
            `;
            ul.appendChild(li);
        });
    }

    window.showForm = showForm;
    window.showFormDeThi = showFormDeThi;
    window.addQuestion = addQuestion;
    window.removeQuestion = removeQuestion;
    window.importFromExcel = importFromExcel;
});

function closeAddCauHoiDeThi() {
    document.getElementById('formContainer').style.display = 'none';
}

// Hàm để thêm các đề thi vào datalist
function addDeThiToDatalist() {

    var selectElement = document.getElementById("optionListDeThi");

    deThiArray.forEach(function (deThi) {
        var optionElement = document.createElement("option");
        optionElement.value = deThi.id; // Giả sử id của môn thi là giá trị của option
        optionElement.textContent = deThi.ten; // Giả sử tenMon là tên môn thi
        selectElement.appendChild(optionElement);
    });
}

function closeModalDeThiForm() {
    document.getElementById('deThiFormContainer').style.display = 'none';
}



// Bắt sự kiện khi form được submit
document.getElementById("deThiForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    // Lấy giá trị từ các trường input và select trong form
    var ten = document.getElementById("name").value;
    var monThiId = document.getElementById("optionMonThi").value;
    var kyThiId = document.getElementById("optionKyThi").value;
    var trangThaiValue = document.getElementById("optionStatus").value;

    // Chuyển đổi giá trị thành true hoặc false
    var trangThai = trangThaiValue === '1' ? true : false;
    var thoiGianLamBai = document.getElementById("timeExam").value;



    var ngayThi = document.getElementById("dateExam").value;
    var dateObject = new Date(ngayThi.replace('T', ' ').replace(/-/g, '/'));
    var timeZoneOffset = dateObject.getTimezoneOffset() * 60000;
    dateObject.setTime(dateObject.getTime() - timeZoneOffset);
    var isoString = dateObject.toISOString();


    // Tạo đối tượng chứa dữ liệu để gửi đến API
    var body = {
        ten: ten,
        trangThai: trangThai,
        thoiGianLamBai: thoiGianLamBai,
        lichThi: isoString
    };

    var token = sessionStorage.getItem('token')

    const requestOptions = {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token, // Gửi token dưới dạng Bearer Token
            'Content-Type': 'application/json' // Định dạng dữ liệu gửi đi là JSON
        },
        body: JSON.stringify(body)
    };

    // Gửi request POST đến API
    fetch(`http://localhost:8088/quiz/admin/creatDeThi?kyThiId=${kyThiId}&monThiId=${monThiId}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            window.location.reload();
            return response.json();
        })
        .then(data => {
            console.log("Response from API:", data);
            // Xử lý dữ liệu trả về từ API ở đây (nếu cần)
        })
        .catch(error => {
            console.error("There has been a problem with your fetch operation:", error);
        });
});


function saveQuestions() {
    // Lấy danh sách các câu hỏi từ form
    var ul = document.getElementById("questions");
    var questions = ul.getElementsByTagName("li");
    // Reset mảng newQuestions
    newQuestions = [];
    // Lặp qua từng câu hỏi và lưu vào mảng newQuestions
    for (var i = 0; i < questions.length; i++) {
        var li = questions[i];
        var textareas = li.getElementsByTagName("textarea");
        var select = li.querySelector("select");
        var question = {
            deBai: textareas[0].value,
            a: textareas[1].value,
            b: textareas[2].value,
            c: textareas[3].value,
            d: textareas[4].value,
            dapAn: select.value
        };
        newQuestions.push(question);

    }
    console.log(newQuestions);
}

function createCauHoiObjects(newQuestions) {
    var cauHoiList = [];
    for (var i = 0; i < newQuestions.length; i++) {
        var question = newQuestions[i];
        var cauHoi = {
            deBai: question.deBai,
            a: question.a,
            b: question.b,
            c: question.c,
            d: question.d,
            dapAn: question.dapAn
        };
        cauHoiList.push(cauHoi);
    }
    return cauHoiList;
}



document.getElementById("addCauHoiForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form
    var deThiId = document.getElementById("optionListDeThi").value;
    addDeThiToDatalist();
    saveQuestions();
    // Tạo body cho yêu cầu fetch, sử dụng mảng newQuestions
    var body = createCauHoiObjects(newQuestions);

    console.log(JSON.stringify(body));

    var token = sessionStorage.getItem('token')
    // Gọi hàm gửi câu hỏi lên server và truyền deThiId vào
    const requestOptions = {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token, // Gửi token dưới dạng Bearer Token
            'Content-Type': 'application/json' // Định dạng dữ liệu gửi đi là JSON
        },
        body: JSON.stringify(body)
    };

    fetch(`http://localhost:8088/quiz/admin/${deThiId}/creatCauHoi`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Xử lý dữ liệu phản hồi ở đây (nếu cần)
            console.log('Danh sách câu hỏi đã được thêm:', data);
            // Sau khi gửi thành công, reset mảng câu hỏi mới
            newQuestions = [];

            window.location.reload();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

});

function deleteRow(deThiId) {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    var confirmation = confirm("Bạn có chắc chắn muốn xóa đề thi này?");

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

        // Thực hiện yêu cầu DELETE đến API để xóa đề thi
        fetch(`http://localhost:8088/quiz/admin/deleteDeThi/${deThiId}`, requestOptions)
            .then(response => {
                // Kiểm tra xem yêu cầu có thành công không
                if (!response.ok) {
                    throw new Error('Không thể xóa đề thi. Vui lòng thử lại!');
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
        console.log("Hủy bỏ xóa đề thi.");
    }
}


function getCauHois(deThiId) {
    var questionsDetail = [];

    var token = sessionStorage.getItem('token');

    const requestOptions = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    fetch(`http://localhost:8088/quiz/users/getListCauHoiInDeThi?deThiId=${deThiId}`, requestOptions)
        .then(response => {
            if (response.status === 404) {
                return response.json();
            }
            return response.json();

        })
        .then(data => {
            document.getElementById('editCauHoiDeThi').style.display = 'block';
            document.getElementById('show_exam').style.display = 'none';
            document.getElementById('themDeThi').style.display = 'none';
            document.getElementById('ThemThi').style.display = 'none';
            dethidetail = data.result;

            dethidetail.dsCauHoi.forEach(cauHoi => {
                var questionData = {
                    id: cauHoi.id,
                    question: cauHoi.deBai,
                    choices: {
                        a: cauHoi.a,
                        b: cauHoi.b,
                        c: cauHoi.c,
                        d: cauHoi.d
                    },
                    dapAn: cauHoi.dapAn
                };
                questionsDetail.push(questionData);
            });
            var ul = document.getElementById("questionsDetail");
            var questionNumber = 0;
            questionsDetail.forEach(function (row) {
                var li = document.createElement("li");
                li.setAttribute('data-id', row.id);
                li.className = "cauHoiInDeThi";
                questionNumber++;
                li.innerHTML = `
                <p><b>Câu hỏi ${questionNumber}</b></p>
                    <textarea class="textcauHoiInDeThi" name="question" placeholder="Câu hỏi">${row.question}</textarea>
                    <textarea class="textcauHoiInDeThi" name="answerA" placeholder="Đáp án A">${row.choices["a"]}</textarea>
                    <textarea class="textcauHoiInDeThi" name="answerB" placeholder="Đáp án B">${row.choices["b"]}</textarea>
                    <textarea class="textcauHoiInDeThi" name="answerC" placeholder="Đáp án C">${row.choices["c"]}</textarea>
                    <textarea class="textcauHoiInDeThi" name="answerD" placeholder="Đáp án D">${row.choices["d"]}</textarea>
                    <label>Đáp án đúng:</label>
                    <select name="correctAnswer">
                        <option value="a" ${row.dapAn === "a" ? "selected" : ""}>A</option>
                        <option value="b" ${row.dapAn === "b" ? "selected" : ""}>B</option>
                        <option value="c" ${row.dapAn === "c" ? "selected" : ""}>C</option>
                        <option value="d" ${row.dapAn === "d" ? "selected" : ""}>D</option>
                    </select>
                    <button class="btn" type="button" onclick="saveChangeQuestion(this)">Lưu thay đổi</button>
                `;
                ul.appendChild(li);
            });

        })
        .catch(error => {

        });

}


// Đóng modal
function closeCauHoiDeThiModal() {
    var ul = document.getElementById("questionsDetail");
    ul.innerHTML = ""; // Xóa nội dung của ul
    document.getElementById('editCauHoiDeThi').style.display = 'none';
    document.getElementById('show_exam').style.display = 'block';
    document.getElementById('themDeThi').style.display = 'block';
    document.getElementById('ThemThi').style.display = 'block';
}


function openModal(id) {

    var deThi = deThiArray.find(item => item.id === id);
    if (!deThi) {
        console.error('Không tìm thấy mục với id', id);
        return;
    }
    document.getElementById('oldTenDeThi').value = deThi.ten;
    document.getElementById('oldTrangThai').value = deThi.trangThai ? "1" : "0"; // Gán giá trị "1" nếu trạng thái là true, ngược lại gán "0"
    document.getElementById('oldThoiGianThi').value = deThi.thoiGianLamBai;
    document.getElementById('oldLichThi').value = convertToDateTimeLocal(deThi.lichThi);
    document.getElementById('editDeThi').style.display = 'block';
    // Thiết lập thuộc tính data-id cho nút lưu thay đổi
    var saveChangesButton = document.getElementById('saveChangesButton');
    saveChangesButton.setAttribute('data-id', id);
    saveChangesButton.onclick = function () {
        saveChanges(id);
    };
}

// Đóng modal
function closeModal() {

    document.getElementById('editDeThi').style.display = 'none';
}
function saveChanges(id) {


    var ten = document.getElementById("oldTenDeThi").value;
    var trangThaiValue = document.getElementById("oldTrangThai").value;

    // Chuyển đổi giá trị thành true hoặc false
    var trangThai = trangThaiValue === '1' ? true : false;
    var thoiGianLamBaiStr = document.getElementById("oldThoiGianThi").value;
    var thoiGianLamBai = parseInt(thoiGianLamBaiStr);


    // Lấy giá trị từ trường input datetime-local
    var ngayThi = document.getElementById("oldLichThi").value;
    var dateObject = new Date(ngayThi.replace('T', ' ').replace(/-/g, '/'));
    var timeZoneOffset = dateObject.getTimezoneOffset() * 60000;
    dateObject.setTime(dateObject.getTime() - timeZoneOffset);
    var isoString = dateObject.toISOString();

    var body = {
        ten: ten,
        trangThai: trangThai,
        thoiGianLamBai: thoiGianLamBai,
        lichThi: isoString
    };
    console.log('data: ', body);

    var token = sessionStorage.getItem('token');

    const requestOptions = {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    fetch(`http://localhost:8088/quiz/admin/updateDeThi/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể cập nhật đề thi. Vui lòng thử lại!');
            }
            console.log('Thông tin đề thi đã được cập nhật.');

        })
        .catch(error => {
            alert('Sửa Đề thi thành công!')
        });
}


function saveChangeQuestion(button) {

    var li = button.parentElement; // 'this' ở đây tham chiếu đến nút đã nhấn
    var cauHoiId = li.getAttribute('data-id'); // Lấy id từ thuộc tính data-id
    var question = li.querySelector('textarea[name="question"]').value;
    var answerA = li.querySelector('textarea[name="answerA"]').value;
    var answerB = li.querySelector('textarea[name="answerB"]').value;
    var answerC = li.querySelector('textarea[name="answerC"]').value;
    var answerD = li.querySelector('textarea[name="answerD"]').value;
    var correctAnswer = li.querySelector('select[name="correctAnswer"]').value;

    var body = {
        deBai: question,
        a: answerA,
        b: answerB,
        c: answerC,
        d: answerD,
        dapAn: correctAnswer
    }

    var token = sessionStorage.getItem('token');

    const requestOptions = {
        method: "PUT",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    fetch(`http://localhost:8088/quiz/admin/updateCauHoi/${cauHoiId}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể cập nhật kỳ thi. Vui lòng thử lại!');

            }
            return response.json();
        })
        .then(data => {
            alert('Sửa câu hỏi thành công!')
            closeCauHoiDeThiModal();
        })
        .catch(error => {
            console.error('Xảy ra lỗi:', error);
        });
}


function convertToDateTimeLocal(dateTimeString) {
    // Tạo một đối tượng Date từ chuỗi đầu vào
    var dateTimeParts = dateTimeString.split(" ");
    var dateString = dateTimeParts[1];
    var timeString = dateTimeParts[0];
    var dateParts = dateString.split("/");
    var timeParts = timeString.split(":");
    var year = parseInt(dateParts[2], 10);
    var month = parseInt(dateParts[1], 10) - 1; // Tháng trong JavaScript bắt đầu từ 0
    var day = parseInt(dateParts[0], 10);
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);
    var seconds = parseInt(timeParts[2], 10);

    // Tạo một đối tượng Date từ các thành phần trên
    var dateObject = new Date(year, month, day, hours, minutes, seconds);

    // Lấy thông tin về múi giờ của máy tính người dùng
    var timezoneOffset = dateObject.getTimezoneOffset();

    // Điều chỉnh thời gian để phản ánh múi giờ địa phương
    dateObject.setMinutes(dateObject.getMinutes() - timezoneOffset);

    // Chuyển đổi đối tượng Date thành chuỗi theo định dạng của datetime-local
    var isoString = dateObject.toISOString().slice(0, 16); // Cắt bớt phần giây và mili giây

    return isoString;
}



