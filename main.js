let العنوان = document.getElementById("العنوان");
let السعر = document.getElementById("السعر");
let الضرائب = document.getElementById("الضرائب");
let الإعلانات = document.getElementById("الإعلانات");
let الخصم = document.getElementById("الخصم");
let الإجمالي = document.getElementById("الإجمالي");
let العدد = document.getElementById("العدد");
let الفئة = document.getElementById("الفئة");
let الإرسال = document.getElementById("الإرسال");
let الحالة = "إنشاء";
let مؤقت;

function احسب_الإجمالي() {
    if (السعر.value !== "") {
        let النتيجة = (+السعر.value + +الضرائب.value + +الإعلانات.value) - +الخصم.value;
        الإجمالي.innerHTML = النتيجة;
        
        
        الإجمالي.style.text = "total:";
        الإجمالي.style.backgroundColor = "gold";
        // الإجمالي.style.color = "black";
    } else {
        الإجمالي.innerHTML = "";
        الإجمالي.style.backgroundColor = "red";
        الإجمالي.style.color = "black";
        
        // الإجمالي.style.backgroundColor = "red";
    }
}

let بيانات_المنتج;
if (localStorage.getItem("المنتج") !== null) {
    بيانات_المنتج = JSON.parse(localStorage.getItem("المنتج"));
} else {
    بيانات_المنتج = [];
}

الإرسال.onclick = function () {
    let منتج_جديد = {
        title: العنوان.value,
        price: السعر.value,
        taxes: الضرائب.value,
        ads: الإعلانات.value,
        discount: الخصم.value,
        total: الإجمالي.innerHTML,
        count: العدد.value,
        category: الفئة.value
    };
    if (منتج_جديد.title.trim() === "" || منتج_جديد.price.trim() === "" || منتج_جديد.category.trim() === "" ) {
        alert("يرجى ملء جميع الحقول."); // إظهار رسالة للمستخدم
        return; // الخروج من الدالة دون إضافة البيانات
    }

    // التحقق من أن عدد العناصر أقل من 100
    if (parseInt(منتج_جديد.count) >= 100) {
        alert("يجب أن يكون العدد أقل من 100."); // إظهار رسالة للمستخدم
        return; // الخروج من الدالة دون إضافة البيانات
    }

    if (منتج_جديد.title !== "" && منتج_جديد.price !== "" && منتج_جديد.category !== "" && منتج_جديد.count < 100) {
        if (الحالة === "إنشاء") {
            if (منتج_جديد.count > 1) {
                for (let i = 0; i < منتج_جديد.count; i++) {
                    بيانات_المنتج.push(منتج_جديد);
                }
            } else {
                بيانات_المنتج.push(منتج_جديد);
            }
        } else {
            بيانات_المنتج[مؤقت] = منتج_جديد;
            الحالة = "إنشاء";
            الإرسال.innerHTML = "إنشاء";
            العدد.style.display = "block";
        }
        نظف_البيانات();
        
    }
    بيانات_المنتج.unshift(منتج_جديد);

    localStorage.setItem("المنتج", JSON.stringify(بيانات_المنتج));
    اعرض_البيانات();
}

function نظف_البيانات() {
    العنوان.value = "";
    السعر.value = "";
    الإعلانات.value = "";
    الضرائب.value = "";
    الخصم.value = "";
    الإجمالي.innerHTML = "";
    العدد.value = "";
    الفئة.value = "";
}

function اعرض_البيانات() {
    let جدول = "";
    for (let i = 0; i < بيانات_المنتج.length; i++) {
        جدول += `
            <tr>
                <td>${i + 1}</td>
                <td>${بيانات_المنتج[i].title}</td>
                <td>${بيانات_المنتج[i].price}</td>
                <td>${بيانات_المنتج[i].taxes}</td>
                <td>${بيانات_المنتج[i].ads}</td>
                <td>${بيانات_المنتج[i].discount}</td>
                <td>${بيانات_المنتج[i].innerHTML}</td>
                <td>${بيانات_المنتج[i].category}</td>
                <td><button onclick="تحديث_البيانات(${i})" id="update">تحديث</button></td>
                <td><button onclick="حذف_البيانات(${i})" id="delete">حذف</button></td>
            </tr>
        `;
    }
    document.getElementById("الجسم").innerHTML = جدول;
    let زر_الحذف = document.getElementById("حذف_الكل");
    if (بيانات_المنتج.length > 0) {
        زر_الحذف.innerHTML = `<button onclick="حذف_الكل()">حذف الكل (${بيانات_المنتج.length})</button>`;
    } else {
        زر_الحذف.innerHTML = "";
    }
}
اعرض_البيانات();

function حذف_البيانات(i) {
    بيانات_المنتج.splice(i, 1);
    localStorage.setItem("المنتج", JSON.stringify(بيانات_المنتج));
    اعرض_البيانات();
}

function حذف_الكل() {
    localStorage.clear();
    بيانات_المنتج.splice(0);
    اعرض_البيانات();
}

function تحديث_البيانات(i) {
    العنوان.value = بيانات_المنتج[i].title;
    السعر.value = بيانات_المنتج[i].price;
    الضرائب.value = بيانات_المنتج[i].taxes;
    الإعلانات.value = بيانات_المنتج[i].ads;
    الخصم.value = بيانات_المنتج[i].discount;
    الإجمالي.innerHTML = بيانات_المنتج[i].total;
    احسب_الإجمالي();
    العدد.style.display = "none";
    الإرسال.innerHTML = "تحديث";
    الحالة = "تحديث";
    مؤقت = i;
    الفئة.value = بيانات_المنتج[i].category;
    scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
}

let نوع_البحث = "العنوان";

function اختيار_نوع_البحث(id) {
    let بحث = document.getElementById("بحث");
    if (id === "بحث_عن_العنوان") {
        نوع_البحث = "العنوان";
        بحث.placeholder = "البحث حسب العنوان";
    } else {
        نوع_البحث = "الفئة";
        بحث.placeholder = "البحث حسب الفئة";
    }
    بحث.focus();
    بحث.value = "";
    اعرض_البيانات();
}

function بحث_البيانات(value) {
    let جدول;
    if (نوع_البحث === "العنوان") {
        for (let i = 0; i < بيانات_المنتج.length; i++) {
            if (بيانات_المنتج[i].title.includes(value)) {
                جدول += `
                <tr>
                    <td>${i}</td>
                    <td>${بيانات_المنتج[i].title}</td>
                    <td>${بيانات_المنتج[i].price}</td>
                    <td>${بيانات_المنتج[i].taxes}</td>
                    <td>${بيانات_المنتج[i].ads}</td>
                    <td>${بيانات_المنتج[i].discount}</td>
                    <td>${بيانات_المنتج[i].total}</td>
                    <td>${بيانات_المنتج[i].category}</td>
                    <td><button onclick="تحديث_البيانات(${i})" id="update">تحديث</button></td>
                    <td><button onclick="حذف_البيانات(${i})" id="delete">حذف</button></td>
                </tr>
            `;
            }
        }
    } else {
        for (let i = 0; i < بيانات_المنتج.length; i++) {
            if (بيانات_المنتج[i].category.includes(value)) {
                جدول += `
                <tr>
                    <td>${i}</td>
                    <td>${بيانات_المنتج[i].title}</td>
                    <td>${بيانات_المنتج[i].price}</td>
                    <td>${بيانات_المنتج[i].taxes}</td>
                    <td>${بيانات_المنتج[i].ads}</td>
                    <td>${بيانات_المنتج[i].discount}</td>
                    <td>${بيانات_المنتج[i].total}</td>
                    <td>${بيانات_المنتج[i].category}</td>
                    <td><button onclick="تحديث_البيانات(${i})" id="update">تحديث</button></td>
                    <td><button onclick="حذف_البيانات(${i})" id="delete">حذف</button></td>
                </tr>
            `;
            }
        }
    }
    document.getElementById("الجسم").innerHTML = جدول;
}
