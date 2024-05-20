function showResult() {
    var fullName = document.getElementById("fullName").value;
    var resultTable = document.getElementById("resultTable");
    
    // Mô phỏng dữ liệu kết quả từ cơ sở dữ liệu
    var results = [
      {
        ma: "001",
        ten: "Nguyễn Văn A",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 1",
        thoiGian: "10/02/2024",
        diem: 8.5,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "001",
        ten: "Nguyễn Văn A",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 2",
        thoiGian: "20/02/2024",
        diem: 4,
        tinhTrang: "Trượt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "002",
        ten: "Trần Thị B",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 1",
        thoiGian: "10/02/2024",
        diem: 9,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "002",
        ten: "Trần Thị B",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 2",
        thoiGian: "15/02/2024",
        diem: 7.0,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "002",
        ten: "Trần Thị B",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 3",
        thoiGian: "25/02/2024",
        diem: 7.0,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "002",
        ten: "Trần Thị B",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 4",
        thoiGian: "01/03/2024",
        diem: 5.0,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "002",
        ten: "Trần Thị B",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 5",
        thoiGian: "15/03/2024",
        diem: 7.0,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "002",
        ten: "Trần Thị B",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 6",
        thoiGian: "15/04/2024",
        diem: 8.0,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
      {
        ma: "002",
        ten: "Trần Thị B",
        monThi: "Toán 2",
        kyThi: "Kỳ thi 7",
        thoiGian: "20/04/2024",
        diem: 9.0,
        tinhTrang: "Đạt",
        chiTiet: "Xem chi tiết"
      },
    ];
    // Kiểm tra xem mã sinh viên đã được nhập hay chưa
    if (!fullName) {
      alert("Vui lòng nhập mã sinh viên.");
      resultTable.style.display = "none";
      exportBtn.style.display = "none";
      return;
    }
    // Tìm kết quả tương ứng với mã sinh viên đã nhập
    var matchedResult = results.find(function(result) {
      return result.ma === fullName;
    });
    // Nếu không tìm thấy kết quả tương ứng, hiển thị thông báo và không hiển thị bảng kết quả
    if (!matchedResult) {
      alert("Không tìm thấy thông tin cho mã sinh viên: " + fullName);
      resultTable.style.display = "none";
      exportBtn.style.display = "none";
      return;
    }
    var rowCount = resultTable.rows.length;

    // Xóa tất cả các hàng từ hàng thứ hai trở đi
    for (var i = rowCount - 1; i > 0; i--) {
        resultTable.deleteRow(i);
    }
    // Hiển thị bảng kết quả và điền thông tin vào bảng
    results.forEach(function(matchedResult) {
      resultTable.style.display = "table";
      exportBtn.style.display = "block";
      var resultBody = document.getElementById("resultBody");
      // Kiểm tra nếu mã sinh viên của phần tử khớp với mã sinh viên nhập vào
      if (matchedResult.ma.toString() === fullName.toString()) {
        // Tạo một hàng mới cho bảng kết quả
        var row = resultTable.insertRow();
        var maCell = row.insertCell(0);
        var tenCell = row.insertCell(1);
        var monThiCell = row.insertCell(2);
        var kyThiCell = row.insertCell(3);
        var thoiGianCell = row.insertCell(4);
        var diemCell = row.insertCell(5);
        var tinhTrangCell = row.insertCell(6);
        var chiTietCell = row.insertCell(7);

        maCell.textContent = matchedResult.ma;
        tenCell.textContent = matchedResult.ten;
        monThiCell.textContent = matchedResult.monThi;
        kyThiCell.textContent = matchedResult.kyThi;
        thoiGianCell.textContent = matchedResult.thoiGian;
        diemCell.textContent = matchedResult.diem;
        tinhTrangCell.textContent = matchedResult.tinhTrang;
        chiTietCell.innerHTML = '<button class="chitiet" onclick="viewDetail()">Xem chi tiết</button>';
      }
    });
  }
  // Danh sách các câu hỏi và đáp án
  var questions = [
    {
      question: '1 + 9 =',
      answers: ['A: 10', 'B: 11', 'C: 12', 'D: 0'],
      correctAnswer: 'A',
      studentAnswer: 'A'
    },
    {
      question: '1 * 9 =',
      answers: ['A: 10', 'B: 11', 'C: 12', 'D: 9'],
      correctAnswer: 'D',
      studentAnswer: 'A'
    },
    {
      question: '2 + 10 =',
      answers: ['A: 10', 'B: 11', 'C: 12', 'D: 0'],
      correctAnswer: 'C',
      studentAnswer: 'C'
    },
    {
      question: '2 + 9 =',
      answers: ['A: 10', 'B: 11', 'C: 12', 'D: 0'],
      correctAnswer: 'B',
      studentAnswer: 'B'
    },
    {
      question: '3 + 7 =',
      answers: ['A: 10', 'B: 11', 'C: 12', 'D: 0'],
      correctAnswer: 'A',
      studentAnswer: 'A'
    },
    {
      question: '10 + 9 =',
      answers: ['A: 19', 'B: 11', 'C: 12', 'D: 0'],
      correctAnswer: 'A',
      studentAnswer: 'C'
    },
    {
      question: '10 * 9 =',
      answers: ['A: 19', 'B: 90', 'C: 12', 'D: 9'],
      correctAnswer: 'B',
      studentAnswer: 'A'
    },
    {
      question: '2 * 10 =',
      answers: ['A: 10', 'B: 20', 'C: 12', 'D: 10'],
      correctAnswer: 'B',
      studentAnswer: 'B'
    },
    {
      question: '2 * 6 =',
      answers: ['A: 10', 'B: 11', 'C: 12', 'D: 20'],
      correctAnswer: 'C',
      studentAnswer: 'B'
    },
    {
      question: '3 + 1 =',
      answers: ['A: 10', 'B: 4', 'C: 5', 'D: 0'],
      correctAnswer: 'B',
      studentAnswer: 'B'
    },
  ];
  // Hàm để xáo trộn mảng
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Hàm hiển thị chi tiết câu hỏi
  function viewDetail() {
    var questionDetail = document.getElementById('questionDetail');
    questionDetail.innerHTML = '';
    // Xáo trộn câu hỏi
    shuffleArray(questions);

    // Lặp qua mỗi câu hỏi và hiển thị chi tiết
    questions.forEach(function(questionObj, index) {
      var questionContent = 'Câu hỏi ' + (index + 1) + ': ' + questionObj.question + '<br>';
      questionObj.answers.forEach(function(answer) {
        questionContent += answer + '<br>';
      });
      
      var studentAnswer = questionObj.studentAnswer;
      var correctAnswer = questionObj.correctAnswer;

      // Thêm thông tin câu hỏi và đáp án vào modal
      questionDetail = document.getElementById('questionDetail');
      questionDetail.innerHTML += '<br>' + questionContent + '<br>Câu trả lời của thí sinh: ' + studentAnswer + '<br>Đáp án: ' + correctAnswer + '<hr>';
      console.log(questionContent);
    });

    // Hiển thị modal
    var modal = document.getElementById('detailModal');
    modal.style.display = 'block';
  }

  // Lấy tất cả các nút "Xem chi tiết" trong bảng
  var detailButtons = document.querySelectorAll('.chitiet');

  // Lặp qua từng nút và gán sự kiện click
  detailButtons.forEach(function(button) {
    button.addEventListener('click', viewDetail);
  });

  // Hàm để tắt modal
  function closeModal() {
    var modal = document.getElementById('detailModal');
    modal.style.display = 'none';
  }
  function exportToPDF() {
    // Tạo một đối tượng jsPDF
    var doc = new jsPDF();
    // Lấy dữ liệu từ bảng kết quả
    const table = document.getElementById("resultTable");

    // Chuyển đổi bảng thành dạng đối tượng dữ liệu (array)
    const data = [];
    for (let i = 1; i < table.rows.length; i++) {
      const rowData = [];
      for (let j = 0; j < table.rows[i].cells.length-1; j++) {
        rowData.push(table.rows[i].cells[j].innerText);
      }
      data.push(rowData);
    }

    // Tạo tiêu đề cho tài liệu PDF
    const title = "Table Score";

    // Thêm tiêu đề vào tài liệu PDF
    doc.text(title, 10, 10);
    // Thêm bảng dữ liệu vào tài liệu PDF
    doc.autoTable({
      startY: 20,
      head: [[
        "Mã",
        "Tên",
        "Môn Thi",
        "Kỳ Thi",
        "Thời Gian",
        "Điểm",
        "Tình Trạng",
      ]],
      body: data,
    });
    doc.autoPrint({variant:'non-conform'});
    // Lưu tài liệu PDF với tên file là 'ket_qua_thi.pdf'
    doc.save('Ket_qua_thi.pdf');
  }

