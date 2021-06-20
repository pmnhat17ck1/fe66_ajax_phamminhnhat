
var kiemTraDuLieu = new Validation();
function getNhanVienApi() {

    //ajax là phương thức bất đồng bộ => trong lúc nó thực thi gửi request đi, thì các tác vụ tiếp theo vẫn làm 
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayDanhSachNhanVien', //thông tin backend cung cấp
        method: 'GET', //Giao thức backend cung cấp
        responseType: 'json' //Kiểu dữ liệu trả về do backend cung cấp
    });

    //Hàm xử lý request thành công
    promise.then(function (result) {
        console.log('1');
        console.log(result.data);
        //Từ dữ liệu backend gửi về viết hàm hiển thị dữ liệu lên table
        renderTableNhanVien(result.data);
    });

    //Hàm xử lý request thất bại
    promise.catch(function (errors) {
        console.log('errors', errors);
    });


    console.log('2');

}
getNhanVienApi();
function renderTableNhanVien(arrSV) { //input
    var content = '';
    for (var index = 0; index < arrSV.length; index++) {

        var nv = arrSV[index];
        //Mỗi lần duyệt lấy ra 1 đối tượng sinh viên
        var nhanVien = new NhanVien(nv.maNhanVien, nv.tenNhanVien, nv.chucVu, nv.heSoChucVu, nv.luongCoBan, nv.soGioLamTrongThang);
        console.log(nhanVien)
        //Từ đối tượng sinh viên => tạo ra thẻ tr
        var trNhanVien = `
                        <tr>
                            <td>${nhanVien.maNhanVien}</td>
                            <td>${nhanVien.tenNhanVien}</td>
                            <td>${nhanVien.chucVu}</td>
                            <td>${nhanVien.luongCoBan}</td>
                            <td>${nhanVien.TongLuong()}</td>
                            <td>${nhanVien.soGioLamTrongThang}</td>
                            <td>${nhanVien.xepLoai()}</td>
                            <td>
                            <button class="btn btn-danger" onclick="xoaNhanVien('${nhanVien.maNhanVien}')" >Xoá
                            </button>
                            <button class="btn btn-primary" onclick="suaThongTin('${nhanVien.maNhanVien}')" >chỉnh sửa
                            </button>
                            </td>
                        </tr>
        `;
        content += trNhanVien;
    }
    //Dom đến thẻ tblnhanvien chèn chuỗi content vào innerHTML
    document.querySelector('#tblNhanVien').innerHTML = content;
}

// -------------------------- Nghiệp vụ thêm nhan viên (POST DATA) -------------------------------


document.querySelector('#btnXacNhan').onclick = function (event) {
    event.preventDefault();
  
    //Lấy thông tin người dùng nhập vào theo format data backend yêu cầu
    var nhanvien = new NhanVien();

    var slChucVu = document.querySelector('#ChucVu');
    var viTriOptionDcChon = slChucVu.selectedIndex;
    var content = slChucVu[viTriOptionDcChon].innerHTML;

    nhanvien.maNhanVien = document.querySelector('#maNhanVien').value;
    nhanvien.tenNhanVien = document.querySelector('#tenNhanVien').value;
    nhanvien.chucVu = content;
    nhanvien.heSoChucVu = document.querySelector('#ChucVu').value;
    nhanvien.luongCoBan = document.querySelector('#luongCB').value;
    nhanvien.soGioLamTrongThang = document.querySelector('#soGioLamTrongThang').value;
    console.log('NhanVien', nhanvien);
   
    //-----------------------------------Validation-------------------------------------
    // (1): Kiểm tra rỗng
    var valid = true; //.trim(): loại bỏ khoảng trống đầu và cuối của chuỗi
    valid &= kiemTraDuLieu.kiemTraRong(nhanvien.maNhanVien,'#error_required_maNhanVien','Mã nhân viên') & kiemTraDuLieu.kiemTraRong(nhanvien.tenNhanVien,'#error_required_tenNhanVien','Tên nhân viên') & kiemTraDuLieu.kiemTraRong(nhanvien.luongCoBan,'#error_required_luongCB','Lương căn bản') &  kiemTraDuLieu.kiemTraRong(nhanvien.soGioLamTrongThang,'#error_required_soGioLamTrongThang','Số giờ làm trong tháng');
    // (2): Kiểm tra định dạng
    // (2.1): Kiểm tra tất cả là ký tự (allLetter)
    
    valid &= kiemTraDuLieu.kiemTraTatCaKyTu(nhanvien.tenNhanVien,'#error_allLetter_tenNhanVien','Tên Nhân viên');
    // (2.2): Kiểm tra tất cả là ký tự (allNumber)
    valid &= kiemTraDuLieu.kiemTraTatCaSo(nhanvien.maNhanVien,'#error_allNumber_maNhanVien','Mã nhân viên') ;
    

    // Kiểm tra giá trị
    valid &= kiemTraDuLieu.kiemTraGiaTri(nhanvien.luongCoBan,'#error_min_max_value_LuongCB',100000,20000000,'lương căn bản') & kiemTraDuLieu.kiemTraGiaTri(nhanvien.soGioLamTrongThang,'#error_min_max_value_soGioLamTrongThang',50,150,'Số giờ làm trong tháng');

    //Kiểm tra độ dài
    valid &= kiemTraDuLieu.kiemTraDoDai(nhanvien.maNhanVien,'#error_min_max_length_maNhanVien',4,6,'Mã nhân viên')


    if(!valid) {
        return;
    }




    var promise = axios({
        url: 'http://svcy.myclass.vn/api/QuanLyNhanVienApi/ThemNhanVien', //Đường dẫn backend yêu cầu
        method: 'POST', //Phương thức backend yêu cầu
        data: nhanvien //Dữ liệu gửi đi phải đúng định dạng
    })
    //Xử lý thành công
    promise.then(function (result) {
        console.log('result', result.data);
        //Load lại table từ api get layThongTinnhanvien
        getNhanVienApi();
    })

    //Xử lý thất bại
    promise.catch(function (error) {
        console.log('error', error.reponse.data);
    })
    refreshInfomation();

}


//------------------------------------------ Xoá nhan viên -----------------------------


function xoaNhanVien(maNhanVienClick) {

    var promise = axios({
        url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/XoaNhanVien?maSinhVien=${maNhanVienClick}`,
        method: 'DELETE'
    });


    promise.then(function (result) {
        console.log('result', result.data);
        //Xoá thành công load lại table
        getNhanVienApi();
    });

    promise.catch(function (error) {
        console.log('error', error.response.data);
    })

}


//-----------------------------Sửa nhan viên -------------------

function suaThongTin(maNhanVien) {
    
    var promise = axios({
        url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayThongTinNhanVien?maNhanVien=${maNhanVien}`,
        method: 'GET'
    });

    promise.then(function (result) {
        console.log(result.data);
        var NhanVien = result.data;
        
        //Load dữ liệu lên các input
        document.querySelector('#maNhanVien').value = NhanVien.maNhanVien;
        document.querySelector('#tenNhanVien').value = NhanVien.tenNhanVien;
        document.querySelector('#ChucVu').value = NhanVien.heSoChucVu;
        document.querySelector('#luongCB').value = NhanVien.luongCoBan;
        document.querySelector('#soGioLamTrongThang').value = NhanVien.soGioLamTrongThang;
    });

    promise.then(function (result) {
        console.log(result.data);
    })
    document.querySelector('#btnLuuThongTin').disabled = false;
    document.querySelector('#btnXacNhan').disabled = true;
    document.querySelector('#maNhanVien').disabled = true;
    document.querySelector('#tenNhanVien').focus();

}
function refreshInfomation() {
    document.querySelector('#maNhanVien').value = '';
    document.querySelector('#tenNhanVien').value = '';
    document.querySelector('#ChucVu').value = '';
    document.querySelector('#luongCB').value ='';
    document.querySelector('#soGioLamTrongThang').value = '';
}


//----------------------------------------------------------------Cập nhật dữ liệu ----------------------------------
document.querySelector('#btnLuuThongTin').onclick = function () {

    //Lấy thông tin người dùng sau khi sửa đổi trên giao diện
    var nhanvien = new NhanVien();

    var slChucVu = document.querySelector('#ChucVu');
    var viTriOptionDcChon = slChucVu.selectedIndex;
    var content = slChucVu[viTriOptionDcChon].innerHTML;

    nhanvien.maNhanVien = document.querySelector('#maNhanVien').value;
    nhanvien.tenNhanVien = document.querySelector('#tenNhanVien').value;
    nhanvien.chucVu =content;
    nhanvien.heSoChucVu = document.querySelector('#ChucVu').value;
    nhanvien.luongCoBan = document.querySelector('#luongCB').value;
    nhanvien.soGioLamTrongThang = document.querySelector('#soGioLamTrongThang').value;

     //-----------------------------------Validation-------------------------------------
    // (1): Kiểm tra rỗng
    var valid = true; //.trim(): loại bỏ khoảng trống đầu và cuối của chuỗi
    valid &= kiemTraDuLieu.kiemTraRong(nhanvien.maNhanVien,'#error_required_maNhanVien','Mã nhân viên') & kiemTraDuLieu.kiemTraRong(nhanvien.tenNhanVien,'#error_required_tenNhanVien','Tên nhân viên') & kiemTraDuLieu.kiemTraRong(nhanvien.luongCoBan,'#error_required_luongCB','Lương căn bản') &  kiemTraDuLieu.kiemTraRong(nhanvien.soGioLamTrongThang,'#error_required_soGioLamTrongThang','Số giờ làm trong tháng');
    // (2): Kiểm tra định dạng
    // (2.1): Kiểm tra tất cả là ký tự (allLetter)
    
    valid &= kiemTraDuLieu.kiemTraTatCaKyTu(nhanvien.tenNhanVien,'#error_allLetter_tenNhanVien','Tên Nhân viên');
    // (2.2): Kiểm tra tất cả là ký tự (allNumber)
    valid &= kiemTraDuLieu.kiemTraTatCaSo(nhanvien.maNhanVien,'#error_allNumber_maNhanVien','Mã nhân viên') ;
    

    // Kiểm tra giá trị
    valid &= kiemTraDuLieu.kiemTraGiaTri(nhanvien.luongCoBan,'#error_min_max_value_LuongCB',100000,20000000,'lương căn bản') & kiemTraDuLieu.kiemTraGiaTri(nhanvien.soGioLamTrongThang,'#error_min_max_value_soGioLamTrongThang',50,150,'Số giờ làm trong tháng');

    //Kiểm tra độ dài
    valid &= kiemTraDuLieu.kiemTraDoDai(nhanvien.maNhanVien,'#error_min_max_length_maNhanVien',4,6,'Mã nhân viên')


    if(!valid) {
        return;
    }

    //Gọi api
    var promise = axios({
        url:`http://svcy.myclass.vn/api/QuanLyNhanVienApi/CapNhatThongTinNhanVien?maNhanVien=${nhanvien.maNhanVien}`,
        method:'PUT',
        data:nhanvien
    
    });

    promise.then(function(result) {
        console.log('result',result.data);
        getNhanVienApi();
    })

    promise.catch(function(error) {
        console.log(error.response.data)
    })
    refreshInfomation();
    
    document.querySelector('#btnLuuThongTin').disabled = true;
    document.querySelector('#btnXacNhan').disabled = false;
    document.querySelector('#maNhanVien').disabled = false;

}