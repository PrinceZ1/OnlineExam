var questions = [];
var dethidetail;
var cauTraLoiArray = [];
var examId;
var examSubmitted = false;

window.onload = function () {
  // Hàm lấy thông tin từ URL parameters
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  // Dữ liệu câu hỏi
  questions = [
    // {
    //   id: ,
    //   question: "Câu hỏi 1: Nội dung của câu hỏi 1?",
    //   choices: ["Lựa chọn A1", "Lựa chọn B1", "Lựa chọn C1", "Lựa chọn D1"]
    // },

  ];


  // Lấy thông tin về tên bài thi từ URL parameters
  examId = getParameterByName('examId');
  console.log(examId);
  var examName = getParameterByName('examName');
  var examType = getParameterByName('examType');
  var monThi = getParameterByName('monThi');
  var kyThi = getParameterByName('kyThi');

  var token = sessionStorage.getItem('token');

  // Thực hiện yêu cầu fetch đến API
  fetch(`http://localhost:8088/quiz/users/getListCauHoiInDeThi?deThiId=${examId}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(response => {
      if (response.status === 404) { // Kiểm tra nếu không tìm thấy userId
        return response.json(); // Trả về một Promise chứa dữ liệu JSON từ phản hồi
      }
      return response.json(); // Trả về dữ liệu JSON từ phản hồi nếu mọi thứ diễn ra đúng

    })
    .then(data => {

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
          }
        };
        questions.push(questionData); // Thêm câu hỏi vào mảng questions
      });
      console.log(questions);
      // Hiển thị thông tin về bài thi trên trang
      var examInfoDiv = document.getElementById('examInfo');
      examInfoDiv.innerHTML = '<h1>' + examName + '</h1>';
      var examInfoDiv = document.getElementById('examInfo_type');
      examInfoDiv.innerHTML = '<p>' + examType + '</p>';

      // Hiển thị câu hỏi và lựa chọn từ danh sách câu hỏi
      var questionsDiv = document.getElementById('questions');
      questions.forEach(function (questionData, index) {
        var dapAnIndex = 65;
        var questionElement = document.createElement('div');
        questionElement.classList.add('questionshow');
        questionElement.innerHTML = '<h3>' + 'Câu ' + (index + 1) + ': ' + questionData.question + '</h3>';
        var optionsDiv = document.createElement('div');
        var choiseIndex = 65;
        optionsDiv.classList.add('options');
        Object.keys(questionData.choices).forEach(function (key) {
          var choice = questionData.choices[key];

          var choiceLabel = document.createElement('label');
          var choiceInput = document.createElement('input');
          choiceInput.type = 'radio';
          choiceInput.name = 'question' + index;
          choiceInput.value = choiceInput.value = String.fromCharCode(choiseIndex).toLowerCase();
          choiseIndex++;
          choiceInput.setAttribute('data-question-id', questionData.id);

          choiceInput.addEventListener('change', function (event) {
            var cauHoiId = event.target.getAttribute('data-question-id');
            var answer = event.target.value;

            var cauTraLoi = cauTraLoiArray.find(item => item.cauHoiId == cauHoiId);
            if (cauTraLoi) {
              cauTraLoi.cauTraLoi = answer;
            } else {
              cauTraLoiArray.push({
                cauHoiId: cauHoiId,
                cauTraLoi: answer
              });
            }
          });

          var choiceLabelContent = String.fromCharCode(dapAnIndex) + '. ' + choice;
          choiceLabel.appendChild(choiceInput);
          choiceLabel.appendChild(document.createTextNode(choiceLabelContent));
          optionsDiv.appendChild(choiceLabel);
          dapAnIndex++;
        });



        questionElement.appendChild(optionsDiv);
        questionsDiv.appendChild(questionElement);
        // Bắt đầu đếm ngược thời gian
        var examTime = dethidetail.thoiGianLamBai * 60; // Thời gian mặc định cho mỗi bài thi (đơn vị: giây)
        var countdownSpan = document.getElementById('countdown');
        startTimer(examTime, countdownSpan);
      });

    })
    .catch(error => {
      // console.error('There has been a problem with your fetch operation:', error);
    });





};

function saveCauTraLoi() {
  // Lấy danh sách các câu hỏi từ form

}




// Hàm đếm ngược thời gian
function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = Math.floor(timer / 60);
    seconds = timer % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = " " + minutes + ":" + seconds;
    if (--timer < 0) {
      timer = 0;
      // Hiển thị thông báo khi hết giờ
      alert("Hết giờ!");
      // Tự động gửi bài khi hết giờ
      submitExam();
    }
  }, 1000);
}

// Hàm gửi bài
function submitExam() {
  // alert("Nộp bài thành công!");
  // window.location.href = "result.html";

  if (!examSubmitted) { // Kiểm tra xem bài thi đã được nộp hay chưa

    var totalQuestions = questions.length; // Số lượng câu hỏi
    var answeredQuestions = cauTraLoiArray.length; // Số lượng câu hỏi đã trả lời
    if (answeredQuestions < totalQuestions) {
      alert("Vui lòng trả lời hết các câu hỏi trước khi nộp bài!");
      return; // Không thực hiện nộp bài nếu chưa trả lời hết
    }

    examSubmitted = true; // Đánh dấu rằng bài thi đã được nộp
    console.log(cauTraLoiArray);

    var body = cauTraLoiArray;

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

    fetch(`http://localhost:8088/quiz/users/ketqua?deThiId=${examId}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        
        // Sau khi gửi thành công, reset mảng câu hỏi mới
        Questions = [];
        localStorage.setItem('resultData', JSON.stringify(data.result));
        alert("Nộp bài thành công!");
        window.location.href = "result.html";
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
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