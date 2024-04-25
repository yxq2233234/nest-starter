export interface BusinessErrorInfo {
  errorCode: number;
  httpStatus: number;
  message: string;
}

export class BusinessError extends Error {
  errorCode: number;
  httpStatus: number;

  constructor(errorInfo: BusinessErrorInfo) {
    super(errorInfo.message);
    this.name = 'BusinessError';
    this.errorCode = errorInfo.errorCode;
    this.httpStatus = errorInfo.httpStatus;
  }
}

export const commonBusinessErrorInfos = {
  tooFrequent: { errorCode: 101, httpStatus: 400, message: '操作过于频繁，请稍后再试' },
  unknown: { errorCode: 102, httpStatus: 500, message: '未知错误' },
  unauthorized: { errorCode: 103, httpStatus: 401, message: '未授权' },
};
