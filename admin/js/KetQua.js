

var results = [];
var resultsDetail = [];

function showResult() {
  var userId = document.getElementById("userId").value;
  var resultTable = document.getElementById("resultTable");
  var exportBtn = document.getElementById("exportBtn");

  var token = sessionStorage.getItem('token');

  // Thực hiện yêu cầu fetch đến API
  fetch(`http://localhost:8088/quiz/admin/ketquauser?userId=${userId}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(response => {
      if (response.status === 404) { // Kiểm tra nếu không tìm thấy userId
        return response.json(); // Trả về một Promise chứa dữ liệu JSON từ phản hồi
      } else if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        return response.json(); // Trả về dữ liệu JSON từ phản hồi nếu mọi thứ diễn ra đúng
      }
    })
    .then(data => {
      if (data.code === 1005) { // Kiểm tra nếu không tìm thấy userId
        alert("Người dùng không tồn tại.");
        resultTable.style.display = "none"; // Ẩn bảng kết quả
        exportBtn.style.display = "none"; // Ẩn nút xuất
        return; // Dừng hàm showResult nếu không có dữ liệu để hiển thị
      }

      results = data.result;
      console.log(results);
      results.dsDeThiDaLam.sort((a, b) => new Date(a.ngaythi) - new Date(b.ngaythi));
      resultsDetail = data.result.dsDeThiDaLam.flatMap(exam =>
        exam.dsKetQuaDaNop.flatMap(submission =>
          submission.dsChiTietKetQua
        )
      );

      var resultBody = document.getElementById("resultBody");
      var stt = 0;
      results.dsDeThiDaLam.forEach(function (exam, index) {
        exam.dsKetQuaDaNop.forEach(function (submission, submissionIndex) {
          stt++;
          resultTable.style.display = "table";
          exportBtn.style.display = "block";
          var row = document.createElement("tr");
          row.innerHTML = `
            <td>${stt}</td>
            <td>${submission.tenUser}</td>
            <td>${exam.tenDeThi}</td>
            <td>${formatDateTime(submission.ngaythi)}</td>
            <td>${submission.diem}</td>
            <td>
              <button class="chitiet" onclick="viewDetail(${index}, ${submissionIndex})">Xem chi tiết</button>
            </td>
          `;
          resultBody.appendChild(row);
        });
      });

    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

  // Xóa tất cả các hàng từ hàng thứ hai trở đi
  var rowCount = resultTable.rows.length;
  for (var i = rowCount - 1; i > 0; i--) {
    resultTable.deleteRow(i);
  }
}

// Function to format LocalDateTime string to display in HTML
function formatDateTime(localDateTimeString) {
  // Create a new Date object from the LocalDateTime string
  var date = new Date(localDateTimeString);
  // Return the formatted date and time
  return date.toLocaleString();
}


// Hàm để xáo trộn mảng
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function viewDetail(examIndex, submissionIndex) {
  var questionDetail = document.getElementById('questionDetail');
  questionDetail.innerHTML = '';

  var details = results.dsDeThiDaLam[examIndex].dsKetQuaDaNop[submissionIndex].dsChiTietKetQua;

  // Kiểm tra xem details có dữ liệu không
  if (!details || details.length === 0) {
    console.error("Không có dữ liệu câu hỏi.");
    return;
  }

  // Xáo trộn câu hỏi
  shuffleArray(details);
  console.log(details);
  // Lặp qua mỗi câu hỏi và hiển thị chi tiết
  details.forEach(function (detail, index) {
    var isCorrect = detail.cauTraLoi === detail.cauHoi.dapAn;
    var cauTraLoiBackColor = isCorrect ? 'rgba(144, 238, 144, 0.3)' : 'rgba(240, 128, 128, 0.3)';
    var cauTraLoiColor = isCorrect ? 'green' : 'red';

    // Xây dựng nội dung câu hỏi với màu nền tương ứng
    var questionContent = '<div class="questionContent" style="background-color:' + cauTraLoiBackColor + ';">';
    questionContent += '<b>Câu hỏi ' + (index + 1) + ': </b>' + detail.cauHoi.deBai + '<br>';
    questionContent += 'A. ' + detail.cauHoi.a + '<br>';
    questionContent += 'B. ' + detail.cauHoi.b + '<br>';
    questionContent += 'C. ' + detail.cauHoi.c + '<br>';
    questionContent += 'D. ' + detail.cauHoi.d + '<br>';

    questionContent += '<span style="color:' + cauTraLoiColor + '"><b>Câu trả lời: ' + detail.cauTraLoi.toUpperCase() + '</b></span><br>';
    questionContent += '<span style="color: green">Đáp án đúng: ' + detail.cauHoi.dapAn.toUpperCase() + '</span><br>';
    questionContent += '</div><hr>';

    // Thêm thông tin câu hỏi và đáp án vào modal
    questionDetail.innerHTML += questionContent;
  });


  // Hiển thị modal
  var modal = document.getElementById('detailModal');
  modal.style.display = 'block';
}


// Lấy tất cả các nút "Xem chi tiết" trong bảng
var detailButtons = document.querySelectorAll('.chitiet');

// Lặp qua từng nút và gán sự kiện click
detailButtons.forEach(function (button) {
  button.addEventListener('click', viewDetail);
});

// Hàm để tắt modal
function closeModal() {
  var modal = document.getElementById('detailModal');
  modal.style.display = 'none';
}


function exportToPDF() {
  // Lấy dữ liệu từ bảng kết quả
  const table = document.getElementById("resultTable");

  // Chuyển đổi bảng thành dạng đối tượng dữ liệu (array)
  const data = [];
  for (let i = 1; i < table.rows.length; i++) {
    const rowData = [];
    for (let j = 0; j < table.rows[i].cells.length - 1; j++) {
      rowData.push(table.rows[i].cells[j].innerText);
    }
    data.push(rowData);
  }

  // Tạo tiêu đề cho tài liệu PDF
  const options = {
    filename: 'Ket_qua_thi.pdf',
    margin: 1,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  // Sử dụng html2pdf để chuyển đổi bảng thành PDF và lưu
  html2pdf().set(options).from(table).save();
}