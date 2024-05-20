document.addEventListener("DOMContentLoaded", function() {
    function showForm() {
        document.getElementById("formContainer").style.display = "block";
        addQuestion();
    }

    // Dữ liệu mẫu
    var sampleData = [
        { tenKyThi: "Luyện tập", soLuongMonThi: 10, tongSoBaiThi: 50, soLuongBaiMo: 30, soLuongBaiDong: 20, tongSoLanThamGia: 1500 },
        { tenKyThi: "Giữa kỳ", soLuongMonThi: 10, tongSoBaiThi: 40, soLuongBaiMo: 25, soLuongBaiDong: 15, tongSoLanThamGia: 400 },
        { tenKyThi: "Cuối kỳ", soLuongMonThi: 10, tongSoBaiThi: 60, soLuongBaiMo: 35, soLuongBaiDong: 25, tongSoLanThamGia: 600 }
    ];

    // Hiển thị dữ liệu mẫu trong bảng HTML
    var statsBody = document.getElementById("statsBody");
    sampleData.forEach(function(data, index) {
        var row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.tenKyThi}</td>
            <td>${data.soLuongMonThi}</td>
            <td>${data.tongSoBaiThi}</td>
            <td>${data.soLuongBaiMo}</td>
            <td>${data.soLuongBaiDong}</td>
            <td>${data.tongSoLanThamGia}</td>
        `;
        statsBody.appendChild(row);
    });
    

    function addQuestion() {
        var ul = document.getElementById("questions");
        var li = document.createElement("li");
        li.innerHTML = `
            <textarea name="question" placeholder="Câu hỏi"></textarea>
            <textarea name="answerA" placeholder="Đáp án A"></textarea>
            <textarea name="answerB" placeholder="Đáp án B"></textarea>
            <textarea name="answerC" placeholder="Đáp án C"></textarea>
            <textarea name="answerD" placeholder="Đáp án D"></textarea>
            <label>Đáp án đúng:</label>
            <select name="correctAnswer">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select>
            <button type="button" onclick="editQuestion(this)">Chỉnh sửa</button>
            <button type="button" onclick="removeQuestion(this)">Xóa</button>
        `;
        ul.appendChild(li);
    }

    function editQuestion(button) {
        var li = button.parentElement;
        var textareas = li.getElementsByTagName("textarea");
        var selects = li.getElementsByTagName("select");
    
        for (var i = 0; i < textareas.length; i++) {
            textareas[i].removeAttribute("readonly");
        }
    
        for (var i = 0; i < selects.length; i++) {
            selects[i].removeAttribute("disabled");
        }
    
        button.innerHTML = "Lưu";
        button.setAttribute("onclick", "saveQuestion(this)");
    }
    

    function saveQuestion(button) {
        var li = button.parentElement;
        var textareas = li.getElementsByTagName("textarea");
        for (var i = 0; i < textareas.length; i++) {
            textareas[i].setAttribute("readonly", "readonly");
        }
        button.innerHTML = "Chỉnh sửa";
        button.setAttribute("onclick", "editQuestion(this)");
    }

    function removeQuestion(button) {
        var li = button.parentElement;
        li.parentElement.removeChild(li);
    }

    function importFromExcel() {
        var input = document.createElement('input');
        input.type = 'file';

        input.onchange = function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            
            reader.onload = function(event) {
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
        data.forEach(function(row) {
            var li = document.createElement("li");
            li.innerHTML = `
                <textarea name="question" placeholder="Câu hỏi">${row["Câu hỏi"]}</textarea>
                <textarea name="answerA" placeholder="Đáp án A">${row["Đáp án A"]}</textarea>
                <textarea name="answerB" placeholder="Đáp án B">${row["Đáp án B"]}</textarea>
                <textarea name="answerC" placeholder="Đáp án C">${row["Đáp án C"]}</textarea>
                <textarea name="answerD" placeholder="Đáp án D">${row["Đáp án D"]}</textarea>
                <label>Đáp án đúng:</label>
                <select name="correctAnswer">
                    <option value="A" ${row["Đáp án đúng"] === "A" ? "selected" : ""}>A</option>
                    <option value="B" ${row["Đáp án đúng"] === "B" ? "selected" : ""}>B</option>
                    <option value="C" ${row["Đáp án đúng"] === "C" ? "selected" : ""}>C</option>
                    <option value="D" ${row["Đáp án đúng"] === "D" ? "selected" : ""}>D</option>
                </select>
                <button type="button" onclick="editQuestion(this)">Chỉnh sửa</button>
                <button type="button" onclick="removeQuestion(this)">Xóa</button>
            `;
            ul.appendChild(li);
        });
    }

    window.showForm = showForm;
    window.addQuestion = addQuestion;
    window.editQuestion = editQuestion;
    window.saveQuestion = saveQuestion;
    window.removeQuestion = removeQuestion;
    window.importFromExcel = importFromExcel;
});
