// Sample data of exams
var exams = [];
var dethiArray = [];

// var additionalExams = [
//   { namedetail: "Môn E", name: "Luyện tập - Kỳ I - 2023", status: "open" },
//   { namedetail: "Môn E", name: "Giữa kỳ - Kỳ I - 2023", status: "open" },
//   { namedetail: "Môn E", name: "Cuối kỳ - Kỳ I - 2023", status: "open" },
//   { namedetail: "Môn F", name: "Luyện tập - Kỳ II - 2023", status: "open" },
//   { namedetail: "Môn F", name: "Giữa kỳ - Kỳ II - 2023", status: "open" },
//   { namedetail: "Môn F", name: "Cuối kỳ - Kỳ II - 2023", status: "open" },
//   // Add more exam objects as needed
// ];


var token = sessionStorage.getItem('token');

fetch(`http://localhost:8088/quiz/users/getAllDeThi`, {
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
    dethiArray = data.result;
    // Hiển thị danh sách kỳ thi (hoặc thực hiện các hành động khác tùy ý)
    console.log('Danh sách đề thi:', dethiArray);
    // Hiển thị dữ liệu mẫu trong bảng HTML
    var statsBody = document.getElementById("statsBody");
    dethiArray.forEach(dethi => {
      // Biến đổi dữ liệu từ dethiArray thành định dạng tương tự như additionalExams
      const examObject = {
        id: dethi.id,
        namedetail: dethi.tenMonThi, // Giả sử dữ liệu trong dethi.tenMonThi là tên chi tiết môn thi
        name: dethi.tenKyThi + " - " + dethi.ten, // Giả sử dữ liệu trong dethi.tenKyThi là tên kỳ thi
        status: dethi.trangThai ? 'open' : 'closed' // Chuyển trạng thái từ dạng dữ liệu của dethi sang dạng của additionalExams
      };

      // Thêm đối tượng kỳ thi vào mảng exams
      exams.push(examObject);
    });
    console.log(exams);
    filterExamsCombined()
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
      optionElement.value = monThi.tenMon; // Giả sử id của môn thi là giá trị của option
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
      optionElement.value = kyThi.ten; // Giả sử id của môn thi là giá trị của option
      optionElement.textContent = kyThi.ten; // Giả sử tenMon là tên môn thi
      selectElement.appendChild(optionElement);
    });
  })
  .catch(error => {
    // Xử lý lỗi nếu có
    console.error('There has been a problem with your fetch operation:', error);
  });


// Gộp các bài thi mới vào mảng exams
// exams.push(...additionalExams);
console.log('exams', exams);

// Hàm lọc dữ liệu dựa trên cả "type" và "status" sau khi nhấp vào nút "Lọc"
function filterExamsCombined() {
  const kyThi = document.getElementById("optionKyThi").value; // Lấy giá trị loại kỳ thi từ select có ID là "optionKyThi"
  const monThi = document.getElementById("optionMonThi").value; // Lấy giá trị loại môn thi từ select có ID là "optionMonThi"
  const status = document.getElementById("status").value;
  console.log('kyThi', kyThi)
  console.log('monThi', monThi)
  console.log('status', status)

  let filteredExams = [];

  if (monThi === "all" && kyThi === "all" && status === "all") {
    // Nếu cả ba trường đều là "all", hiển thị tất cả các kỳ thi
    filteredExams = exams;
  } else {
    // Lọc dữ liệu dựa trên các trường đã chọn
    filteredExams = exams.filter(exam => {
      const matchType = monThi === "all" || exam.namedetail === monThi;
      const matchKyThi = kyThi === "all" || exam.name.includes(kyThi);
      const matchStatus = status === "all" || exam.status === status;
      return matchType && matchKyThi && matchStatus;
    });
  }

  // Hiển thị kết quả sau khi lọc
  displayExams(filteredExams);
}



// Function to display exams on the web page
function displayExams(examsToShow) {
  const examListElement = document.getElementById("examList");
  examListElement.innerHTML = "";
  examsToShow.forEach(exam => {
    const card = document.createElement("div");
    card.classList.add("cardd");

    //ảnh
    const examImage = document.createElement("img");
    examImage.src = `https://eduquiz.vn/_next/image?url=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fquiz-comic-pop-art-style_175838-505.jpg%3Fw%3D600&w=1920&q=60`; // Thay 'exam.imageSrc' bằng đường dẫn đến hình ảnh của bạn
    examImage.classList.add("img-quiz");
    examImage.alt = "Ảnh kỳ thi"; // Đặt text mô tả hình ảnh của bạn
    card.appendChild(examImage); // Đính kèm phần tử hình ảnh vào thẻ card

    const examNameDetail = document.createElement("div");
    examNameDetail.classList.add("exam-name");
    examNameDetail.textContent = exam.namedetail;
    card.appendChild(examNameDetail);

    // const examType = document.createElement("div");
    // examType.textContent = `Loại: ${exam.name}`;
    // card.appendChild(examType);

    const examType = document.createElement("div");
    const maxLength = 30; // Đặt độ dài tối đa của tên đầu là 10 ký tự (bạn có thể thay đổi giá trị này tùy ý)

    let displayedName = exam.name;
    if (exam.name.length > maxLength) {
      displayedName = exam.name.substring(0, maxLength) + "..."; // Cắt chuỗi và thêm ba dấu chấm nếu tên quá dài
    }

    examType.textContent = `Loại: ${displayedName}`;
    card.appendChild(examType);

    const examStatus = document.createElement("div");
    examStatus.textContent = `Trạng thái: ${exam.status}`;
    card.appendChild(examStatus);

    const startButton = document.createElement("button");
    startButton.classList.add("button-start")
    startButton.textContent = "Bắt đầu làm";
    startButton.onclick = function () {
      startExam(exam.id, exam.namedetail, exam.name, exam.monThi, exam.kyThi);
    };

    // Thêm thông báo và vô hiệu hóa nút "Bắt đầu làm" nếu kỳ thi đang đóng
    if (exam.status === "closed") {
      const notAvailableMessage = document.createElement("div");
      notAvailableMessage.textContent = "";
      card.appendChild(notAvailableMessage);
      startButton.disabled = true;
    }

    card.appendChild(startButton);
    examListElement.appendChild(card);
  });

}

// Hàm xử lý chuyển trang khi click vào nút start
//Thông tin về tên bài kiểm tra sẽ được lưu vào trong URL parameter từ đó trang sau có thể lấy tên bài kiểm tra để hiển thị
function startExam(examId, examName, examType, monThi, kyThi) {
  window.location.href = "question.html?examId=" + encodeURIComponent(examId) + "&examName=" + encodeURIComponent(examName) + "&examType=" + encodeURIComponent(examType) + "&monThi=" + encodeURIComponent(monThi) + "&kyThi=" + encodeURIComponent(kyThi);
}

// Function to simulate logout
function logout() {
  window.location.href = "/index.html";
  // Add your code to perform logout action
}

// Function to navigate to home
function goHome() {
  window.location.href = "../html/home.html";
  // Add your code to navigate to the home page
}

function goexamdone() {
  alert("Go to manage info page!");
  window.open("../html/baidalam.html", "_blank");
  // Add your code to navigate to the home page
}

// Initial display of exams when the page loads
// displayExams(exams);



