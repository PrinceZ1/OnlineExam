
var resultData = JSON.parse(localStorage.getItem('resultData'));
var soCauDung = resultData.soCauDung;
var tongSoCau = resultData.tongSoCau;
var diem = resultData.diem;


var correctAnswersSpan = document.getElementById('soCauDung');
correctAnswersSpan.innerHTML = 'Tổng số câu đúng là: <span id="correct-answers">' + soCauDung + '/' + tongSoCau + '</span>';

var correctAnswersSpan = document.getElementById('diem');
correctAnswersSpan.innerHTML = 'Điểm số của bạn là: <span id="score">' + diem + '</span>';

function viewResultDetails() {
  var answerDetailsDiv = document.getElementById('result-details');
  var viewResultDetailBtn = document.getElementById('view-result-detail-btn');

  // Kiểm tra xem chi tiết đã được hiển thị chưa
  if (answerDetailsDiv.style.display === 'none') {
    // Xử lý logic để lấy và điền dữ liệu chi tiết vào đây
    var detailHTML = '<h2>Chi tiết câu trả lời:</h2>';


    var dsChiTietKetQuas = resultData.dsChiTietKetQua;
    var userAnswers = [];
    var questions = [];
    dsChiTietKetQuas.forEach(function (item) {
      var cauHoi = item.cauHoi;
      var cauTraLoi = item.cauTraLoi;
      userAnswers.push(cauTraLoi);
      questions.push(cauHoi);
    });

    // Duyệt qua từng câu và hiển thị chi tiết
    for (var i = 0; i < userAnswers.length; i++) {
      var questionNumber = i + 1;
      var userAnswer = userAnswers[i];
      var correctAnswer = questions[i].dapAn;
      var resultDetailItemClass = userAnswer !== correctAnswer ? 'wrong-answer' : 'success-answer'; // Kiểm tra xem câu trả lời có đúng không
      var isCorrect = userAnswer === correctAnswer;
      var cauTraLoiBackColor = isCorrect ? 'rgba(144, 238, 144, 0.3)' : 'rgba(240, 128, 128, 0.3)';
      var cauTraLoiColor = isCorrect ? 'green' : 'red';
      detailHTML += '<div class="result-detail-item" style="background-color:' + cauTraLoiBackColor + ';">';
      detailHTML += '<p class="result-detail-question"><b>Câu ' + questionNumber + ': </b>' + questions[i].deBai + '</p>'; // Hiển thị đề bài
      detailHTML += '<p class="result-detail-question">A. ' + questions[i].a + '</p>'; // Hiển thị đáp án A
      detailHTML += '<p class="result-detail-question">B. ' + questions[i].b + '</p>'; // Hiển thị đáp án B
      detailHTML += '<p class="result-detail-question">C. ' + questions[i].c + '</p>'; // Hiển thị đáp án C
      detailHTML += '<p class="result-detail-question">D. ' + questions[i].d + '</p>'; // Hiển thị đáp án D
      detailHTML += '<p class="result-detail-question" style="color:' + cauTraLoiColor + '"><b>Câu trả lời của bạn: ' + userAnswer.toUpperCase() + '</b></p>'; // Hiển thị câu trả lời của người dùng
      detailHTML += '<p class="result-detail-answer" style="color: green">Đáp án đúng: ' + correctAnswer.toUpperCase() + '</p>'; // Hiển thị đáp án đúng
      detailHTML += '</div>';
    }

    // Hiển thị kết quả chi tiết trong div
    answerDetailsDiv.innerHTML = detailHTML;
    // Hiển thị phần chi tiết câu trả lời
    answerDetailsDiv.style.display = 'block';
    // Thay đổi nội dung của nút thành "Ẩn chi tiết"
    viewResultDetailBtn.textContent = 'Ẩn chi tiết';
  } else {
    // Nếu chi tiết đã được hiển thị, ẩn nó đi
    answerDetailsDiv.style.display = 'none';
    // Thay đổi nội dung của nút trở lại "Xem kết quả chi tiết"
    viewResultDetailBtn.textContent = 'Xem kết quả chi tiết';
  }
}

function logout() {
  window.location.href = "/index.html";
  // Add your code to perform logout action
}

function goHome() {
  window.location.href = "../html/home.html";
  // Add your code to navigate to the home page
}

function goexamdone() {
  alert("Go to manage info page!");
  window.open("../html/baidalam.html", "_blank");
  // Add your code to navigate to the home page
}