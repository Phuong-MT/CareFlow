export const ERROR_TYPE = {
    REQUIRED: 'required',
    MINLENGTH: 'minlength',
    EMAIL: 'email',
    PATTERN: 'pattern',
    MIN: 'min',
    MAX: 'max',
    EXIST: 'exist',
    NOT_FOUND: 'not_found',
    IN_VALID: 'in_valid',
    CANNOT_DELETE: 'cannot_delete',
  };

  export const transformError = (field: string, type: string) => {
    // using vietnamese message
    switch (type) {
      case ERROR_TYPE.NOT_FOUND:
        return `${field} không tìm thấy`;
      case ERROR_TYPE.EXIST:
        return `${field} đã tồn tại`;
      case ERROR_TYPE.REQUIRED:
        return `${field} không được để trống`;
      case ERROR_TYPE.MINLENGTH:
        return `${field} phải có ít nhất 6 ký tự`;
      case ERROR_TYPE.EMAIL:
        return `${field} không đúng định dạng email`;
      case ERROR_TYPE.PATTERN:
        return `${field} không đúng định dạng`;
      case ERROR_TYPE.MIN:
        return `${field} phải lớn hơn hoặc bằng 0`;
      case ERROR_TYPE.MAX:
        return `${field} phải nhỏ hơn hoặc bằng 100`;
      case ERROR_TYPE.IN_VALID:
        return `${field} không chính xác`;
      case ERROR_TYPE.CANNOT_DELETE:
        return ` ${field} không thể xóa `;
      default:
        return `${field} không hợp lệ`;
    }
  };