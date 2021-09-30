const addHeight = document.querySelector(".addHeight");
const addWeight = document.querySelector(".addWeight");
const feedbackHeight = document.querySelector(".valid-feedback-height");
const feedbackWeight = document.querySelector(".valid-feedback-weight");
const resultBtn = document.querySelector(".form-section_btn");
const resultBtnShow = document.querySelector(".form-section_btn-show");
let btnBodyType = document.querySelector(".form-section_bodyType");
let btnBmi = document.querySelector(".form-section_bmi");
let table = document.querySelector(".record-section_table");
let refresh = document.querySelector(".refresh");
let isValidated = false;
let data = JSON.parse(localStorage.getItem("BMI Detail")) || [];
let bmiStatus = {
  ideal: {
    recordItemBorder: "recordItemBorder",
    borderColor: "border-green",
    btnBorder: "6px solid",
    color: "#86d73f"
  },
  underweight: {
    recordItemBorder: "recordItemBorder",
    borderColor: "border-blue",
    btnBorder: "6px solid",
    color: "#31baf9"
  },
  overweight: {
    recordItemBorder: "recordItemBorder",
    borderColor: "border-orangeLight",
    btnBorder: "6px solid",
    color: "#ff982d"
  },
  mildObesity: {
    recordItemBorder: "recordItemBorder",
    borderColor: "border-orangeMedium",
    btnBorder: "6px solid",
    color: "#ff6c03"
  },
  moderateObesity: {
    recordItemBorder: "recordItemBorder",
    borderColor: "border-orangeMedium",
    btnBorder: "6px solid",
    color: "#ff6c03"
  },
  severeObesity: {
    recordItemBorder: "recordItemBorder",
    borderColor: "border-red",
    btnBorder: "6px solid",
    color: "#ff1200"
  }
};

// input 有效判斷
function validation(input, feedback) {
  input.addEventListener("input", function () {
    if (input.value !== "") {
      feedback.style.visibility = "hidden";
      isValidated = true;
    } else {
      feedback.style.visibility = "visible";
      isValidated = false;
    }
  });
}
validation(addHeight, feedbackHeight);
validation(addWeight, feedbackWeight);

// 監聽與更新
resultBtn.addEventListener("click", addData);
resultBtnShow.addEventListener("click", refreshData);
renderData(data);

// 將資料加入table，並同步更新資料至localStorage
function addData(e) {
  e.preventDefault();
  let obj = {};
  if (isValidated) {
    // 將資料放進data
    obj.weight = addWeight.value;
    obj.height = addHeight.value;
    data.push(obj);
    // input 清空
    addWeight.value = "";
    addHeight.value = "";
    // 網頁渲染
    renderData(data);
    localStorage.setItem("BMI Detail", JSON.stringify(data));
    // 按鈕display切換
    btnToggle();
  }
}

// 重新整理輸入資料
function refreshData() {
  btnToggle();
  isValidated = false;
  feedbackHeight.style.visibility = "visible";
  feedbackWeight.style.visibility = "visible";
  // validation(addHeight, feedbackHeight);
  // validation(addWeight, feedbackWeight);
}

// 更新網頁內容，同步改變按鈕顏色
function renderData(inputData) {
  table.innerHTML = "";
  let str = "";
  let bodyType = "";
  inputData.forEach(function (item, i) {
    bodyType = BMI(item);
    let nowTime = new Date();
    str += `
			<tr class="${bmiStatus[item.bmiStatus].recordItemBorder} ${bmiStatus[item.bmiStatus].borderColor
      } record-section_item">
				<th class="type">${bodyType}</th>
				<td><span class="bmi">BMI</span><span class="bmiNum">${item.bmiNum}</span></td>
				<td><span class="weight">BMIweight</span><span class="weightNum">${item.weight
      }kg</span></td>
				<td><span class="height">height</span><span class="heightNum">${item.height
      }cm</span></td>
				<td class="date">${nowTime.getMonth() + 1
      }-${nowTime.getDate()}-${nowTime.getFullYear()}</td>
				<td><a href="#" class="record-section_delete" data-delete="${i}">刪除</a></td>
			<tr>
			`;
    table.innerHTML = str;
  });
  btnChangeColor(inputData, bodyType);
}

// bmi計算
function BMI(item) {
  let meter = item.height / 100;
  let bmi = (item.weight / (meter * meter)).toFixed(2);
  switch (true) {
    case bmi < 18.5:
      item.bmiStatus = "underweight";
      item.bmiNum = bmi;
      return "過輕";
    case bmi >= 18.5 && bmi < 24:
      item.bmiStatus = "ideal";
      item.bmiNum = bmi;
      return "理想";
    case bmi >= 24 && bmi < 27:
      item.bmiStatus = "overweight";
      item.bmiNum = bmi;
      return "過重";
    case bmi >= 27 && bmi < 30:
      item.bmiStatus = "mildObesity";
      item.bmiNum = bmi;
      return "輕度肥胖";
    case bmi >= 30 && bmi < 35:
      item.bmiStatus = "moderateObesity";
      item.bmiNum = bmi;
      return "中度肥胖";
    case bmi >= 35:
      item.bmiStatus = "severeObesity";
      item.bmiNum = bmi;
      return "重度肥胖";
    default:
      return "ERROR";
  }
}

// 按鈕display切換及input切換disabled
function btnToggle() {
  resultBtn.classList.toggle("d-none");
  resultBtnShow.classList.toggle("d-block");
  btnBodyType.classList.toggle("d-block");
  addWeight.toggleAttribute("disabled");
  addHeight.toggleAttribute("disabled");
}

// 改變按鈕顏色
function btnChangeColor(inputData, bodyType) {
  if (inputData.length !== 0) {
    // btn 內帶入 bmi 數字及文字
    let lastItem = inputData.length - 1;
    btnBmi.textContent = inputData[lastItem].bmiNum;
    btnBodyType.textContent = bodyType;

    // btn 的 style 更新
    let lastItemStyle = bmiStatus[inputData[lastItem].bmiStatus];
    let color = lastItemStyle.color;
    let btnBorder = lastItemStyle.btnBorder;
    resultBtnShow.style.border = btnBorder;
    resultBtnShow.style.borderColor = color;
    resultBtnShow.style.color = color;
    btnBodyType.style.color = color;
    refresh.style.backgroundColor = color;
  }
}

//刪除全部紀錄
let recordDeleteAll = document.querySelector(".record-section_deleteAll");
recordDeleteAll.addEventListener("click", function (e) {
  e.preventDefault();
  data = [];
  localStorage.setItem("BMI Detail", JSON.stringify(data));
  renderData(data);
});

//刪除個別紀錄
table.addEventListener("click", function (e) {
  e.preventDefault();
  let index = e.target.dataset.delete;
  if (e.target.nodeName === "A") {
    data.splice(index, 1);
    localStorage.setItem("BMI Detail", JSON.stringify(data));
    renderData(data);
  }
});
