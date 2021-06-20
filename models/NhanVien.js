function NhanVien(manv,tennv,chucvu,heSoChucVu,luongCB,soGioLamTrongThang) {
    this.maNhanVien = manv;
    this.tenNhanVien = tennv;
    this.chucVu = chucvu;
    this.heSoChucVu = heSoChucVu;
    this.luongCoBan = luongCB;
    this.soGioLamTrongThang = soGioLamTrongThang;
    this.TongLuong = function () { 
        var output = 0;
        output =this.heSoChucVu * this.luongCoBan
        return output;
    };
    this.xepLoai = function () {
        var hcv =this.heSoChucVu;
        var timework=this.soGioLamTrongThang;
        var output =''
        if (hcv===1) {
            if (timework > 120) {
                output = 'Nhân viên xuất xắc';
            } else if (timework >100 && timework <= 120) {
                output = 'Nhân viên giỏi';
            } else if (timework >80 && timework <=100) {
                output = 'Nhân viên khá';
            } else if (timework >50  && timework <=80) {
                output = 'Nhân viên trung bình';
            } else if (timework<=50) {
                output = 'Nhân viên trung bình';
            }  else {
                output = 'Không hợp lệ !';
            }
        }else{
            output='Chỉ Xếp loại nhân viên!'
        }
        return output;
    }
}